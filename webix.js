/**
 * Created by synopia on 27.06.2014.
 */
var ui_scheme = {
  type: "space",
  rows: [{
    view: "toolbar",
    cols: [{
      view: "label",
      label: "<strong>Factoratio</strong>",
      fillspace: true
    }, {
      view: "button",
      type: "icon",
      icon: "eraser",
      width: 36,
      click: function() {
        logic.reset();
      }
    }, {
      view: "button",
      type: "icon",
      icon: "cog",
      width: 36,
      value: "Setup",
      popup: "setup"
    }]
  }, {
    cols: [{
      view: "combo",
      label: "Recipe",
      suggest: {
        data: selectRecipes
      },
      id: "selected_recipe"
    }, {
      view: "counter",
      min: 1,
      max: 120,
      width: 103,
      id: "selected_recipe_speed",
      on: {
        onChange: function(newv, oldv) {
          logic.updateTargetSpeed(newv);
        }
      }
    }, {
      view: "richselect",
      id: "selected_unit",
      options: [{id:1, value:"u/s"}, {id:2, value:"u/m"}, {id:3, value:"u/h"}],
      value:2,
      width: 100,
      on: {
        onChange: function(newv, oldv) {
          logic.updateTargetSpeed($$("selected_recipe_speed").getValue());
        }
      }
    }, {
      view: "button",
      type: "iconButton",
      icon: "plus",
      width: 40,
      click: function() {
        logic.addRecipe($$("selected_recipe").getValue());
      }
    }, {
      view: "button",
      type: "iconButton",
      icon: "minus",
      width: 40,
      click: function() {
        logic.removeRecipe($$("selected_recipe").getValue());
      }
    }, ]
  }, {
    view: "tabview",
    id: "tabs",
    animate: false,
    cells: [{
      header: "Recipe view",
      body: {
        view: "treetable",
        id: "recipe_tree",
        editable: true,
        editaction: 'click',
        tooltip: true,
        scrollX:false,
        columns: [{
          id: "targetSpeed",
          header: "u/m",
          format: helpers.speedFormat,
          width: 100,
          tooltip: false
        }, {
          id: "name",
          header: "Item",
          fillspace: 1,
          template: "{common.space()}{common.icon()} &nbsp;#value#",
          width: 300,
          tooltip: false
        }, {
          id: "count",
          header: "Count",
          template: helpers.renderCount,
          width: 100,
          tooltip: tooltips.count
        }, {
          id: "factorySpeed",
          header: "u/m/factory",
          format: helpers.speedFormat,
          width: 100,
          tooltip: tooltips.factorySpeed
        }, {
          id: "factory",
          header: "Factory",
          editor: 'myselect',
          width: 250,
          template: helpers.renderFactory,
          options: logic.selectFactories,
          tooltip: tooltips.factory
        }, {
          id: "inputInserters",
          header: "Input inserters",
          editor: 'myselect',
          width: 250,
          template: helpers.renderInputInserters,
          options: logic.selectInserters,
          tooltip: tooltips.inputInserters
        }, {
          id: "outputInserters",
          header: "Output inserters",
          editor: 'myselect',
          width: 250,
          template: helpers.renderOutputInserters,
          options: logic.selectInserters,
          tooltip: tooltips.outputInserters
        }]
      }
    }, {
      header: "Ratio view",
      body: {
        view: "treetable",
        id: "ratio_tree",
        editable: true,
        editaction: 'click',
        tooltip: true,
        columns: [{
          id: "targetSpeed",
          header: "u/m",
          template: helpers.renderSpeedRatio,
          width: 100,
          tooltip: false
        }, {
          id: "name",
          header: "Item",
          template: "{common.space()}{common.icon()} &nbsp;#value#",
          width: 300,
          tooltip: false
        }, {
          id: "count",
          header: "Count",
          template: helpers.renderCount,
          width: 100,
          tooltip: tooltips.count
        }, {
          id: "factorySpeed",
          header: "u/m/factory",
          format: helpers.speedFormat,
          width: 100,
          tooltip: tooltips.factorySpeed
        }, {
          id: "factory",
          header: "Factory",
          editor: 'myselect',
          width: 250,
          template: helpers.renderFactory,
          options: logic.selectFactories,
          tooltip: tooltips.factory
        }, {
          id: "inputInserters",
          header: "Input inserters",
          editor: 'myselect',
          width: 250,
          template: helpers.renderInputInserters,
          options: logic.selectInserters,
          tooltip: tooltips.inputInserters
        }, {
          id: "outputInserters",
          header: "Output inserters",
          editor: 'myselect',
          width: 250,
          template: helpers.renderOutputInserters,
          options: logic.selectInserters,
          tooltip: tooltips.outputInserters
        }]
      }
    }]
  }]
};
function buildData(factories, categories) {
  var result = [];
  $.each(factories, function(index, factory) {
    var found = false;
    if (categories) {
      for (var i = 0; i < factory.categories.length; i++) {
        var category = factory.categories[i];
        if (categories.indexOf(category) != -1) {
          found = true;
          break;
        }
      }
    } else {
      found = true
    }
    if (found) {
      result.push({id: factory.id, name: factory.name, checked: true})
    }
  });
  result.sort(function(a, b) {
    return a.name.localeCompare(b.name)
  });
  return result;
}
var selectableData = []
selectableData.push({name: "Assembling Machines", open: true, data: buildData(factories, ["crafting"])});
selectableData.push({name: "Mining", data: buildData(factories, ["stone_mining", "iron_mining"])});
selectableData.push({name: "Smelting", data: buildData(factories, ["smelting"])});
selectableData.push({name: "Fluid", data: buildData(factories, ["oil-processing", "fluid", "chemistry"])});
selectableData.push({name: "Inserters", data: buildData(inserters)});
var ui_setup = {
  view: "popup",
  id: "setup",
  position: "center",
  width: 600,
  height: 400,
  body: {
    view: "tree",
    id: "setup_tree",
    threeState: true,
    editable: true,
    template: "{common.icon()} {common.checkbox()} &nbsp; #name#",
    data: selectableData
  }
};
