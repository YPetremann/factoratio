/**
 * Created by synopia on 27.06.2014.
 */
selectRecipes = [];
$.each(recipes, function(name, recipe) {
  selectRecipes.push({
    id: name,
    value: recipe.name
  })
});
selectRecipes.sort(function(a, b) {
  return a["value"].localeCompare(b["value"])
});
var helpers = {
  speedFormat: function(value) {
    value = value || 0;
    if (value.total) {
      value = value.total
    }
    return helpers.formatNumber(value, 60, 2);
  },
  countFormat: function(value) {
    return helpers.formatNumber(value, 1, 2);
  },
  formatNumber: function(number, total, digits) {
    total = total || 100;
    digits = digits || 2;
    return +(total * number).toFixed(digits).toString();
  },
  formatModified: function formatModified(text, mod) {
    if (mod) {
      return "<" + mod + ">" + text + "</" + mod + ">"
    } else {
      return text;
    }
  },
  renderSpeed: function(line, common) {
    if (line.factorySpeed) {
      var count = line.targetSpeed / line.factorySpeed.total;
      return helpers.speedFormat(line.targetSpeed) + " (" + helpers.speedFormat(line.factorySpeed.total * Math.ceil(count)) + ")"
    } else {
      return helpers.speedFormat(line.targetSpeed)
    }
  },
  renderSpeedRatio: function(line, common) {
    if (line.$level == 1) {
      return helpers.renderSpeed(line, common)
    } else {
      return helpers.formatNumber(line.relativeSpeed, 100, 0) + "%"
    }
  },
  renderCount: function(line, common) {
    if (line.factorySpeed) {
      var count = line.targetSpeed / line.factorySpeed.total;
      return helpers.countFormat(count) + " (" + helpers.countFormat(Math.ceil(count)) + ")";
    } else {
      return ""
    }
  },
  renderFactory: function(line, common) {
    if (line.factory) {
      var count = line.targetSpeed / line.factorySpeed.total;
      return helpers.countFormat(Math.ceil(count)) + "x " + helpers.formatModified(factories[line.factory].name, line.factoryModified ? "strong" : null) + " (" + helpers.countFormat(count) + "x " + helpers.formatNumber(line.factorySpeed.total, 60) + "/m)";
    } else {
      return "";
    }
  },
  renderInputInserters: function(line, common) {
    if (line.inputInserters) {
      return helpers.formatModified(inserters[line.inputInserters].name, line.inputInsertersModified ? "strong" : null);
    } else {
      return "";
    }
  },
  renderOutputInserters: function(line, common) {
    if (line.outputInserters) {
      return helpers.formatModified(inserters[line.outputInserters].name, line.outputInsertersModified ? "strong" : null);
    } else {
      return "";
    }
  },
  getName: function(item) {
    if (recipes[item] != null) {
      return recipes[item].name;
    } else if (resources[item] != null) {
      return resources[item].name;
    } else {
      return item
    }
  },
  findFactories: function(item) {
    var result = [];
    var recipe = recipes[item];
    var resource = resources[item];
    if (recipe) {
      $.each(factories, function(name, factory) {
        if (factory.categories.indexOf(recipe.category) != -1) {
          if (factory.ingredientCount >= recipe.ingredients.length) {
            result.push(factory);
          }
        }
      });
    } else if (resource) {
      $.each(factories, function(name, factory) {
        if (factory.categories.indexOf(resource.category) != -1) {
          result.push(factory);
        }
      });
    }
    result.sort(function(a, b) {
      return a.speed - b.speed;
    });
    return result;
  }
};
