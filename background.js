

var select_1self = "select_1self";
var frame_1self = '1selfIFrame';

$(document).ready(function() {
  if (window.location.origin === "https://twitter.com") {
    manipulateTwitter();
  } else if (window.location.origin === "https://news.ycombinator.com") {
    manipulateHN();
  }
})

function manipulateTwitter() {
  insertChart();
  var _default = "https://app.1self.co/v1/me/events/internet,social-network,twitter,social-graph,inbound,follower/sample/max(count)/daily/barchart?bgColor=0099cc";
  rememberSelect(select_1self, frame_1self, _default);
}

function rememberSelect(listId, frameId, _default) {

  $('#' + listId).ready(function() {
    var self = $('#' + listId);
    var hostName = window.location.origin;

    chrome.storage.local.get(hostName, function(result) {
      if (chrome.runtime.lastError) {
        /* error */
        self.val(_default);
        return;
      }
      self.val(result[hostName]);
    });

    $('#1self_div').show();

  });

  $('#' + listId).change(function() {
    var hostName = window.location.origin;
    console.log(this.options[this.selectedIndex].value);
    document.getElementById(frameId).src = this.options[this.selectedIndex].value;
    var dataObj = {};
    dataObj[hostName] = this.options[this.selectedIndex].value;
    chrome.storage.local.set(dataObj);
  });
}

function manipulateHN() {

  var karmaField = $(".pagetop")[1];
  var kChildren = $(karmaField).children().detach();
  var karmaText = $(karmaField).text();
  var karma = karmaText.split('(');
  karma = karma[1].split(')');
  karma = karma[0];
  $(karmaField).text('');
  $(karmaField).append(kChildren[0]);
  $(karmaField).append("<span>&nbsp;(</span>");
  $(karmaField).append("<a href='#' id='karma_link'>" + karma + "</a>");
  $(karmaField).append("<span>)&nbsp;|&nbsp;</span>");
  $(karmaField).append(kChildren[1]);

  var tableCell = $(".title")[1];
  $(tableCell).after(buildHNChartHtml());

  var table = $(tableCell).parent().parent().parent();
  $(table).attr('width', '100%');

  var _default = "https://app.1self.co/v1/me/events/internet,social-network,hackernews/sample/max(points)/daily/barchart?bgColor=ff6600";
  rememberSelect(select_1self, frame_1self, _default);
}

function insertChart() {
  var previousSibling = $(".DashboardProfileCard");

  if (previousSibling) {
    $(previousSibling).after(buildTwitterChartHtml());
  }
}

function buildHNChartHtml() {
    var chartJSON = [{
    "itemTitle": 'Karma',
    "objString": 'internet,social-network,hackernews',
    "actionString": 'sample',
    "aggregation": 'max(points)',
    "period": 'daily',
    "chartType": 'barchart',
    "bgColor": 'ff6600'
  },{
    "itemTitle": 'HN Visits',
    "objString": 'ycombinator',
    "actionString": 'browse',
    "aggregation": 'sum(times-visited)',
    "period": 'daily',
    "chartType": 'barchart',
    "bgColor": 'ff6600'
  }];

  // http://app.1self.co/v1/users/m/events/ycombinator/browse/sum(times-visited)/daily/barchart?shareToken=6cabe6dc0f6a175d026b17c2e16610b502fce5c7a7f85d3e4d71a3c4e314afd6&bgColor=1b1b1a&from=2015-03-12T00:00:00.000Z&to=2015-03-18T23:59:59.999Z

  var chartHtml = '';
  chartHtml += '<td rowspan="92" align="right" valign="top">';
  chartHtml += '<div id="1selfFrame" style="display:block;width:80%;">';
  chartHtml += buildChartHtml(chartJSON, "100", "500px"); 
  chartHtml += '</div>';
  chartHtml += '</td>';
  return chartHtml;
}

// https://app.1self.co/v1/me/events/internet,social-network,hackernews/karma,reputation,sample/max(points)/daily/barchart?shareToken=ebd98ba6a0ae5ccaf8e659bb9fe2cb9a43266aff2eb9e174f0e61f69b0d84b00&bgColor=00a2d4&from=2015-03-08T00:00:00.000Z&to=2015-03-14T23:59:59.999Z
// https://app.1self.co/v1/me/events/internet,social-network,hackernews/karma,reputation,sample/max(points)/daily/barchart?shareToken=5a724759edd37d97a2989ab9fb2b6d92df78f53cb89c06dae96e5b360226c1dd&bgColor=00a2d4&from=2015-03-08T00:00:00.000Z&to=2015-03-14T23:59:59.999Z
// https://app.1self.co/v1/me/events/internet,social-network,twitter,social-graph,outbound,following/sample/max(count)/daily/barchart?shareToken=d84a38cf398ef7dc3bbbda3548239e7bf3f24e7814412e074ea1c48dde16d2c9&bgColor=00a2d4&from=2015-03-08T00:00:00.000Z&to=2015-03-14T23:59:59.999Z

function buildTwitterChartHtml() {
  var colour = rgbStringToHex($('.DashboardProfileCard-statValue').css('color'));

  var chartJSON = [{
    "itemTitle": 'Followers',
    "objString": 'internet,social-network,twitter,social-graph,inbound,follower',
    "actionString": 'sample',
    "aggregation": 'max(count)',
    "period": 'daily',
    "chartType": 'barchart',
    "bgColor": colour
  },{
    "itemTitle": 'Following',
    "objString": 'internet,social-network,twitter,social-graph,outbound,following',
    "actionString": 'sample',
    "aggregation": 'max(count)',
    "period": 'daily',
    "chartType": 'barchart',
    "bgColor": colour
  },{
    "itemTitle": 'Tweets published',
    "objString": 'internet,social-network,twitter,tweet',
    "actionString": 'publish',
    "aggregation": 'count',
    "period": 'daily',
    "chartType": 'barchart',
    "bgColor": colour
  },{
    "itemTitle": 'Twitter Visits',
    "objString": 'twitter',
    "actionString": 'browse',
    "aggregation": 'sum(times-visited)',
    "period": 'daily',
    "chartType": 'barchart',
    "bgColor": colour
  }];


  var chartHtml = '';
  chartHtml += '<div id="1self_div" class="module trends" style="display:none;"><div class="flex-module">';
  chartHtml += buildChartHtml(chartJSON, "100", "500px");
  chartHtml += '</div></div>';
  return chartHtml;
}

function rgbStringToHex(rgbString) {
  var colourHex;

  colourHex = rgbString.split('(');
  colourHex = colourHex[1];
  colourHex = colourHex.split(')');
  colourHex = colourHex[0];
  colourHex = colourHex.split(', ');
  colourHex = rgbToHex(parseInt(colourHex[0]), parseInt(colourHex[1]), parseInt(colourHex[2]));

  return colourHex;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function buildChartHtml(chartJSON, width, height) {

  var chartHtml = '';

  if (chartJSON.length > 1) {
    chartHtml += '<select name="selectionField" style="width:' + width + '%;"';
    chartHtml += ' id="'+ select_1self + '" '
    chartHtml += '>';

    for (var i = 0; i < chartJSON.length; i++) {
      chartHtml += '<option value="' + buildIFrameSrc(chartJSON[i]) + '" >';
      chartHtml += chartJSON[i].itemTitle;
      chartHtml += '</option>';
    }

    chartHtml += '</select>';
    chartHtml += "<br />";
  }

  chartHtml += '<iframe id="1selfIFrame" width="' + width + '%" height="' + height + '" ';
  chartHtml += 'src="' + buildIFrameSrc(chartJSON[0]) + '"';
  chartHtml += ' />';

  return chartHtml;
}

function buildIFrameSrc(srcJSON) {
  var iFrameSrc = '';

  iFrameSrc += 'https://app.1self.co/v1/me/events/';
  iFrameSrc += srcJSON.objString;
  iFrameSrc += '/' + srcJSON.actionString + '/' + srcJSON.aggregation + '/';
  iFrameSrc += srcJSON.period + '/' + srcJSON.chartType + '?bgColor=' + srcJSON.bgColor;

  return iFrameSrc;
}