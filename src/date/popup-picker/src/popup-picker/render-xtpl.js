/** Compiled By kissy-xtemplate */
KISSY.add(function () {
    return function (scopes, S, undefined) {
        var buffer = "",
            config = this.config,
            engine = this,
            utils = config.utils;
        var runBlockCommandUtil = utils["runBlockCommand"],
            getExpressionUtil = utils["getExpression"],
            getPropertyOrRunCommandUtil = utils["getPropertyOrRunCommand"];
        buffer += '<div class="';
        var config1 = {};
        var params2 = [];
        params2.push('content');
        config1.params = params2;
        var id0 = getPropertyOrRunCommandUtil(engine, scopes, config1, "getBaseCssClasses", 0, 1, true, undefined);
        buffer += id0;
        buffer += '">\n    ';
        var config4 = {};
        var params5 = [];
        params5.push('date/picker/picker-xtpl');
        config4.params = params5;
        var id3 = getPropertyOrRunCommandUtil(engine, scopes, config4, "include", 0, 2, false, undefined);
        buffer += id3;
        buffer += '\n</div>';
        return buffer;
    };
});