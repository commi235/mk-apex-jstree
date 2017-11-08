create or replace package body mk_apex_jstree
as

  subtype t_max_vc2 is varchar2(32767);

procedure render_jstree
(
  p_item   in            apex_plugin.t_item
, p_plugin in            apex_plugin.t_plugin
, p_param  in            apex_plugin.t_item_render_param
, p_result in out nocopy apex_plugin.t_item_render_result
)
as
  l_display_dom_id t_max_vc2 := p_item.name || '_DISPLAY';
  l_name t_max_vc2;
  l_theme t_max_vc2 := p_item.attribute_01;

  l_hidden_elem t_max_vc2;
  l_display_elem t_max_vc2;

  function get_theme_css_dir
  (
    pi_theme in varchar2
  )
    return varchar2
  as
  begin
    return p_plugin.file_prefix || 'themes/' || pi_theme || '/';
  end get_theme_css_dir;

begin
  l_name := apex_plugin.get_input_name_for_page_item(p_is_multi_value => true);

  apex_css.add_file
  (
    p_name => 'style'
  , p_directory => get_theme_css_dir( pi_theme => l_theme )
  );

  if p_param.is_readonly or p_param.is_printer_friendly then
    apex_plugin_util.print_hidden_if_readonly
    (
      p_item_name           => l_name
    , p_value               => p_param.value
    , p_is_readonly         => p_param.is_readonly
    , p_is_printer_friendly => p_param.is_printer_friendly
    );
    sys.htp.prn (
        '<div ' ||
        'class="' || 'apex-item-plugin' || '" ' ||
        'id="'    || p_item.name|| '_DISPLAY" ' ||
        'value="' || case when p_param.value is null then '' else apex_escape.html_attribute(p_param.value) end || '" />' );
  else
    sys.htp.prn
    (
      '<input type="hidden" ' ||
      apex_plugin_util.get_element_attributes(p_item => p_item, p_name => l_name, p_default_class => 'apex-item-plugin') ||
      'value="' || case when p_param.value is null then '' else apex_escape.html_attribute(p_param.value) end || '" />'
    );
  end if;

  apex_javascript.add_library
  (
    p_name      => 'mk_apex_jstree'
  , p_directory => p_plugin.file_prefix || 'js/'
  );

  apex_javascript.add_onload_code
  (
    p_code => 'mkApexJsTreeInit("' || case 
                          when p_param.is_readonly or p_param.is_printer_friendly
                            then p_item.name || '_DISPLAY'
                          else p_item.name
                        end 
                     || '", "' || apex_plugin.get_ajax_identifier || '");'
  );
  p_result.is_navigable := (not p_param.is_readonly = false and not p_param.is_printer_friendly);
end render_jstree;

procedure ajax_jstree
(
  p_item   in            apex_plugin.t_item
, p_plugin in            apex_plugin.t_plugin
, p_param  in            apex_plugin.t_item_ajax_param
, p_result in out nocopy apex_plugin.t_item_ajax_result
)
as
  l_column_value_list apex_plugin_util.t_column_value_list2;
  l_prev_lvl pls_integer := 1;
  l_cur_lvl pls_integer  := 1;
  l_next_lvl pls_integer := 1;

  function value_is_present
  (
    p_base in varchar2
  , p_value in varchar2
  )
    return boolean
  as
  begin
    return instr(':' || p_base || ':', ':' || p_value || ':') > 0;
  end value_is_present;
begin
  l_column_value_list :=
    apex_plugin_util.get_data2
    (
      p_sql_statement  => p_item.lov_definition
    , p_min_columns    => 3
    , p_max_columns    => 3
    , p_component_name => p_item.name
    )
  ;
  apex_json.open_array;
  for i in 1..l_column_value_list(1).value_list.count
  loop
    if i > 1 then
      l_prev_lvl := l_column_value_list(3).value_list(i-1).number_value;
    end if;
    l_cur_lvl  := l_column_value_list(3).value_list(i).number_value;
    if i < l_column_value_list(1).value_list.count then
      l_next_lvl := l_column_value_list(3).value_list(i+1).number_value;
    end if;

    if l_prev_lvl > l_cur_lvl
    then
      apex_json.close_object;
      apex_json.close_array;
      apex_json.close_object;
    end if;

    apex_json.open_object;
    apex_json.write
    (
      p_name  => 'id'
    , p_value => l_column_value_list(1).value_list(i).number_value
    );
    apex_json.write
    (
      p_name  => 'text'
    , p_value => l_column_value_list(2).value_list(i).varchar2_value
    );

    apex_json.write
    (
      p_name  => 'lvl'
    , p_value => l_column_value_list(3).value_list(i).number_value
    );
    if value_is_present( apex_application.g_x01, l_column_value_list(1).value_list(i).number_value) then
      apex_json.open_object( p_name => 'state');
      apex_json.write
      (
        p_name  => 'selected'
      , p_value => true
      );
      apex_json.close_object;
    end if;
    if l_cur_lvl = l_next_lvl
    then
      apex_json.close_object;
    elsif l_cur_lvl < l_next_lvl
    then
      apex_json.open_array( p_name => 'children' );
    end if;

  end loop;
  apex_json.close_all;
end ajax_jstree;

procedure metadata_jstree
(
  p_item   in            apex_plugin.t_item
, p_plugin in            apex_plugin.t_plugin
, p_param  in            apex_plugin.t_item_meta_data_param
, p_result in out nocopy apex_plugin.t_item_meta_data_result
)
as
begin
  p_result.is_multi_value := true;
  p_result.escape_output := false;
end metadata_jstree;

end mk_apex_jstree;
/
