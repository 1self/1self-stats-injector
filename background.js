var select_1self = "select_1self";
var frame_1self = '1selfIFrame';
var default_available_hosts = ["https://twitter.com", "https://news.ycombinator.com"];
initAfterInstall();

$(document).ready(function() {
        checkTwitter();
        checkHackerNews();

        $('#changeSettingsForm').submit(function(){
                storeSettings();
        });

        checkInjectHostsIntoForm();
});

function initAfterInstall(){
        chrome.storage.local.get("enabledHosts", function(result){
                if (chrome.runtime.lastError || typeof result['enabledHosts'] === 'undefined') {
                        setEnabledHosts(default_available_hosts);
                }
        });
}

function checkInjectHostsIntoForm(){
        getEnabledHosts(function(hosts){
                hosts.forEach(function(host){
                        $('#changeSettingsForm :input[value="' + host + '"]').prop("checked", true);
                });
        });
}

function checkTwitter(){
        var host = "https://twitter.com";
        if(window.location.origin === host)
                checkInjectEnabledForHost(host, manipulateTwitter);
}

function checkHackerNews(){
        var host = "https://news.ycombinator.com";
        if(window.location.origin === host)
                checkInjectEnabledForHost(host, manipulateHN);
}

function checkInjectEnabledForHost(host, callback){
        getEnabledHosts(function(enabledHosts){
                if(enabledHosts.indexOf(host) !== -1){
                        callback();
                }
        });
}

function getEnabledHosts(callback){
        chrome.storage.local.get("enabledHosts", function(result){
                if (chrome.runtime.lastError || typeof result['enabledHosts'] === 'undefined') {
                        callback([]);
                }else{
                        callback(result["enabledHosts"]);
                }
        });
}

function storeSettings(){
        var hosts = [];
        $('#changeSettingsForm input:checked').each(function(index){
                hosts.push($(this).val());
        });

        $('.message').show();
        return setEnabledHosts(hosts);
}

function setEnabledHosts(hosts){
        chrome.storage.local.set({"enabledHosts": hosts});
}

function manipulateTwitter() {
  insertChart();
  rememberSelect(select_1self, frame_1self);
}

function loadIframe(iframeName, url) {
    var $iframe = $('#' + iframeName);
    if ( $iframe.length ) {
        $iframe.attr('src',url);   
        return false;
    }
    return true;
}

function rememberSelect(listId, frameId) {

  $('#' + listId).ready(function() {
    var self = $('#' + listId);
    var hostName = window.location.origin;

    chrome.storage.local.get(hostName, function(result) {
      if (chrome.runtime.lastError || typeof result[hostName] === 'undefined') {
        /* error */
        $('#' + listId)[0].selectedIndex = 0;
        return;
      } else {
        self.val(result[hostName]);
        loadIframe(frameId, result[hostName]);
      }
    });

    $('#' + listId).change(function() {
      var hostName = window.location.origin;
      var value = this.options[this.selectedIndex].value;

      console.log(value);
      loadIframe(frameId, value);
      var dataObj = {};
      dataObj[hostName] = value;
      chrome.storage.local.set(dataObj);
    });
    $('#1self_div').show();
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

  rememberSelect(select_1self, frame_1self);
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

  var chartHtml = '';
  chartHtml += '<td rowspan="92" align="right" valign="top">';
  chartHtml += '<div id="1selfFrame" style="display:block;width:80%;">';
  chartHtml += buildChartHtml(chartJSON, "100", "500px"); 
  chartHtml += '</div>';
  chartHtml += '</td>';
  return chartHtml;
}

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
