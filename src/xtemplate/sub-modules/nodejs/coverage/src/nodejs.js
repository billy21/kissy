function BranchData() {
    this.position = -1;
    this.nodeLength = -1;
    this.src = null;
    this.evalFalse = 0;
    this.evalTrue = 0;

    this.init = function(position, nodeLength, src) {
        this.position = position;
        this.nodeLength = nodeLength;
        this.src = src;
        return this;
    }

    this.ranCondition = function(result) {
        if (result)
            this.evalTrue++;
        else
            this.evalFalse++;
    };

    this.pathsCovered = function() {
        var paths = 0;
        if (this.evalTrue > 0)
          paths++;
        if (this.evalFalse > 0)
          paths++;
        return paths;
    };

    this.covered = function() {
        return this.evalTrue > 0 && this.evalFalse > 0;
    };

    this.toJSON = function() {
        return '{"position":' + this.position
            + ',"nodeLength":' + this.nodeLength
            + ',"src":' + jscoverage_quote(this.src)
            + ',"evalFalse":' + this.evalFalse
            + ',"evalTrue":' + this.evalTrue + '}';
    };

    this.message = function() {
        if (this.evalTrue === 0 && this.evalFalse === 0)
            return 'Condition never evaluated         :\t' + this.src;
        else if (this.evalTrue === 0)
            return 'Condition never evaluated to true :\t' + this.src;
        else if (this.evalFalse === 0)
            return 'Condition never evaluated to false:\t' + this.src;
        else
            return 'Condition covered';
    };
}

BranchData.fromJson = function(jsonString) {
    var json = eval('(' + jsonString + ')');
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

BranchData.fromJsonObject = function(json) {
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

function buildBranchMessage(conditions) {
    var message = 'The following was not covered:';
    for (var i = 0; i < conditions.length; i++) {
        if (conditions[i] !== undefined && conditions[i] !== null && !conditions[i].covered())
          message += '\n- '+ conditions[i].message();
    }
    return message;
};

function convertBranchDataConditionArrayToJSON(branchDataConditionArray) {
    var array = [];
    var length = branchDataConditionArray.length;
    for (var condition = 0; condition < length; condition++) {
        var branchDataObject = branchDataConditionArray[condition];
        if (branchDataObject === undefined || branchDataObject === null) {
            value = 'null';
        } else {
            value = branchDataObject.toJSON();
        }
        array.push(value);
    }
    return '[' + array.join(',') + ']';
}

function convertBranchDataLinesToJSON(branchData) {
    if (branchData === undefined) {
        return '{}'
    }
    var json = '';
    for (var line in branchData) {
        if (json !== '')
            json += ','
        json += '"' + line + '":' + convertBranchDataConditionArrayToJSON(branchData[line]);
    }
    return '{' + json + '}';
}

function convertBranchDataLinesFromJSON(jsonObject) {
    if (jsonObject === undefined) {
        return {};
    }
    for (var line in jsonObject) {
        var branchDataJSON = jsonObject[line];
        if (branchDataJSON !== null) {
            for (var conditionIndex = 0; conditionIndex < branchDataJSON.length; conditionIndex ++) {
                var condition = branchDataJSON[conditionIndex];
                if (condition !== null) {
                    branchDataJSON[conditionIndex] = BranchData.fromJsonObject(condition);
                }
            }
        }
    }
    return jsonObject;
}
function jscoverage_quote(s) {
    return '"' + s.replace(/[\u0000-\u001f"\\\u007f-\uffff]/g, function (c) {
        switch (c) {
            case '\b':
                return '\\b';
            case '\f':
                return '\\f';
            case '\n':
                return '\\n';
            case '\r':
                return '\\r';
            case '\t':
                return '\\t';
            // IE doesn't support this
            /*
             case '\v':
             return '\\v';
             */
            case '"':
                return '\\"';
            case '\\':
                return '\\\\';
            default:
                return '\\u' + jscoverage_pad(c.charCodeAt(0).toString(16));
        }
    }) + '"';
}

function getArrayJSON(coverage) {
    var array = [];
    if (coverage === undefined)
        return array;

    var length = coverage.length;
    for (var line = 0; line < length; line++) {
        var value = coverage[line];
        if (value === undefined || value === null) {
            value = 'null';
        }
        array.push(value);
    }
    return array;
}

function jscoverage_serializeCoverageToJSON() {
    var json = [];
    for (var file in _$jscoverage) {
        var lineArray = getArrayJSON(_$jscoverage[file].lineData);
        var fnArray = getArrayJSON(_$jscoverage[file].functionData);

        json.push(jscoverage_quote(file) + ':{"lineData":[' + lineArray.join(',') + '],"functionData":[' + fnArray.join(',') + '],"branchData":' + convertBranchDataLinesToJSON(_$jscoverage[file].branchData) + '}');
    }
    return '{' + json.join(',') + '}';
}


function jscoverage_pad(s) {
    return '0000'.substr(s.length) + s;
}

function jscoverage_html_escape(s) {
    return s.replace(/[<>\&\"\']/g, function (c) {
        return '&#' + c.charCodeAt(0) + ';';
    });
}
try {
  if (typeof top === 'object' && top !== null && typeof top.opener === 'object' && top.opener !== null) {
    // this is a browser window that was opened from another window

    if (! top.opener._$jscoverage) {
      top.opener._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null) {
    // this is a browser window

    try {
      if (typeof top.opener === 'object' && top.opener !== null && top.opener._$jscoverage) {
        top._$jscoverage = top.opener._$jscoverage;
      }
    }
    catch (e) {}

    if (! top._$jscoverage) {
      top._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null && top._$jscoverage) {
    this._$jscoverage = top._$jscoverage;
  }
}
catch (e) {}
if (! this._$jscoverage) {
  this._$jscoverage = {};
}
if (! _$jscoverage['/nodejs.js']) {
  _$jscoverage['/nodejs.js'] = {};
  _$jscoverage['/nodejs.js'].lineData = [];
  _$jscoverage['/nodejs.js'].lineData[6] = 0;
  _$jscoverage['/nodejs.js'].lineData[7] = 0;
  _$jscoverage['/nodejs.js'].lineData[8] = 0;
  _$jscoverage['/nodejs.js'].lineData[15] = 0;
  _$jscoverage['/nodejs.js'].lineData[23] = 0;
  _$jscoverage['/nodejs.js'].lineData[26] = 0;
  _$jscoverage['/nodejs.js'].lineData[27] = 0;
  _$jscoverage['/nodejs.js'].lineData[28] = 0;
  _$jscoverage['/nodejs.js'].lineData[29] = 0;
  _$jscoverage['/nodejs.js'].lineData[30] = 0;
  _$jscoverage['/nodejs.js'].lineData[31] = 0;
  _$jscoverage['/nodejs.js'].lineData[32] = 0;
  _$jscoverage['/nodejs.js'].lineData[36] = 0;
  _$jscoverage['/nodejs.js'].lineData[37] = 0;
  _$jscoverage['/nodejs.js'].lineData[38] = 0;
  _$jscoverage['/nodejs.js'].lineData[39] = 0;
  _$jscoverage['/nodejs.js'].lineData[40] = 0;
  _$jscoverage['/nodejs.js'].lineData[41] = 0;
  _$jscoverage['/nodejs.js'].lineData[43] = 0;
  _$jscoverage['/nodejs.js'].lineData[49] = 0;
  _$jscoverage['/nodejs.js'].lineData[52] = 0;
  _$jscoverage['/nodejs.js'].lineData[53] = 0;
  _$jscoverage['/nodejs.js'].lineData[55] = 0;
}
if (! _$jscoverage['/nodejs.js'].functionData) {
  _$jscoverage['/nodejs.js'].functionData = [];
  _$jscoverage['/nodejs.js'].functionData[0] = 0;
  _$jscoverage['/nodejs.js'].functionData[1] = 0;
  _$jscoverage['/nodejs.js'].functionData[2] = 0;
  _$jscoverage['/nodejs.js'].functionData[3] = 0;
}
if (! _$jscoverage['/nodejs.js'].branchData) {
  _$jscoverage['/nodejs.js'].branchData = {};
  _$jscoverage['/nodejs.js'].branchData['26'] = [];
  _$jscoverage['/nodejs.js'].branchData['26'][1] = new BranchData();
  _$jscoverage['/nodejs.js'].branchData['40'] = [];
  _$jscoverage['/nodejs.js'].branchData['40'][1] = new BranchData();
  _$jscoverage['/nodejs.js'].branchData['52'] = [];
  _$jscoverage['/nodejs.js'].branchData['52'][1] = new BranchData();
}
_$jscoverage['/nodejs.js'].branchData['52'][1].init(427, 9, 'cacheFile');
function visit3_52_1(result) {
  _$jscoverage['/nodejs.js'].branchData['52'][1].ranCondition(result);
  return result;
}_$jscoverage['/nodejs.js'].branchData['40'][1].init(18, 31, 'cacheFile && cached[subTplName]');
function visit2_40_1(result) {
  _$jscoverage['/nodejs.js'].branchData['40'][1].ranCondition(result);
  return result;
}_$jscoverage['/nodejs.js'].branchData['26'][1].init(118, 24, 'config.extname || \'html\'');
function visit1_26_1(result) {
  _$jscoverage['/nodejs.js'].branchData['26'][1].ranCondition(result);
  return result;
}_$jscoverage['/nodejs.js'].lineData[6]++;
KISSY.add('xtemplate/nodejs', function(S, XTemplate) {
  _$jscoverage['/nodejs.js'].functionData[0]++;
  _$jscoverage['/nodejs.js'].lineData[7]++;
  var fs = require('fs');
  _$jscoverage['/nodejs.js'].lineData[8]++;
  var cached = {};
  _$jscoverage['/nodejs.js'].lineData[15]++;
  return {
  loadFromModuleName: function(moduleName, config) {
  _$jscoverage['/nodejs.js'].functionData[1]++;
  _$jscoverage['/nodejs.js'].lineData[23]++;
  config = S.merge(config, {
  cacheFile: 1});
  _$jscoverage['/nodejs.js'].lineData[26]++;
  config.extname = visit1_26_1(config.extname || 'html');
  _$jscoverage['/nodejs.js'].lineData[27]++;
  var loader = getLoader(config);
  _$jscoverage['/nodejs.js'].lineData[28]++;
  config.name = moduleName;
  _$jscoverage['/nodejs.js'].lineData[29]++;
  config.loader = loader;
  _$jscoverage['/nodejs.js'].lineData[30]++;
  var tpl = loader(moduleName);
  _$jscoverage['/nodejs.js'].lineData[31]++;
  delete config.extname;
  _$jscoverage['/nodejs.js'].lineData[32]++;
  return new XTemplate(tpl, config);
}};
  _$jscoverage['/nodejs.js'].lineData[36]++;
  function getLoader(cfg) {
    _$jscoverage['/nodejs.js'].functionData[2]++;
    _$jscoverage['/nodejs.js'].lineData[37]++;
    var cacheFile = cfg.cacheFile;
    _$jscoverage['/nodejs.js'].lineData[38]++;
    var extname = cfg.extname;
    _$jscoverage['/nodejs.js'].lineData[39]++;
    return function(subTplName) {
  _$jscoverage['/nodejs.js'].functionData[3]++;
  _$jscoverage['/nodejs.js'].lineData[40]++;
  if (visit2_40_1(cacheFile && cached[subTplName])) {
    _$jscoverage['/nodejs.js'].lineData[41]++;
    return cached[subTplName];
  }
  _$jscoverage['/nodejs.js'].lineData[43]++;
  var module = new S.Loader.Module({
  name: subTplName, 
  type: extname, 
  runtime: S});
  _$jscoverage['/nodejs.js'].lineData[49]++;
  var tpl = fs.readFileSync(new S.Uri(module.getFullPath()).getPath(), {
  encoding: 'utf-8'});
  _$jscoverage['/nodejs.js'].lineData[52]++;
  if (visit3_52_1(cacheFile)) {
    _$jscoverage['/nodejs.js'].lineData[53]++;
    cached[subTplName] = tpl;
  }
  _$jscoverage['/nodejs.js'].lineData[55]++;
  return tpl;
};
  }
}, {
  requires: ['xtemplate']});
