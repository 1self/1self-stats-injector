

var select_1self = "select-1self";
if (window.location.origin === "https://twitter.com") {
  // alert('yay');
  manipulateTwitter();
} else if (window.location.origin === "https://news.ycombinator.com") {
  manipulateHN();
}

function getAndInsertInstagramUrl(instagramUrl, theTweet, page) {
  console.log(instagramUrl);
  $.get( 'https://api.instagram.com/oembed?url=' + instagramUrl )
// $.get( 'https://api.instagram.com/v1/users/46161597/media/recent/?client_id=19fc4e4d65ef4ae79d0583119f8f0cd9' )
  .done(function( data ) {

// alert(data.thumbnail_url);
      var imageUrl = data.thumbnail_url;    
      insertInstagram(imageUrl, theTweet, page);    

  });
}

function manipulateTwitter() {

  insertChart();

  var tweets = $(".tweet-text");
  var page = 'main';

  if (tweets.length === 0) {
    tweets = $(".ProfileTweet-text");
    page = 'profile';
  }

  // console.log(tweets);

  for (i=0; i<tweets.length; i++) {
  // for (i=1; i<2; i++) {
  	// alert($(tweets[0]).text());
    //
    var theTweet1 = tweets[i];

    var theTweet = $(theTweet1);

    var matchingChildren = theTweet.children("a.twitter-timeline-link");

    var instagramUrl;

    if (matchingChildren && matchingChildren.length > 0) { 
      for (j=0; j<matchingChildren.length;j++) {
        var theChild = matchingChildren[j];
        if ($(theChild).attr("title") && $(theChild).attr("title").substring(0,20) === "http://instagram.com") {
          instagramUrl = $(theChild).attr("title");

          // alert('found one: ' + instagramUrl);

          getAndInsertInstagramUrl(instagramUrl, theTweet, page);
          break;
        }
      }
    }
  }

  $('#'+select_1self).change(function(){
    document.getElementById('1selfIFrame').src = this.options[this.selectedIndex].value;
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
  $(karmaField).append("<a href='#' onclick='" + buildJSFunction() + "'>" + karma + "</a>");
  $(karmaField).append("<span>)&nbsp;|&nbsp;</span>");
  $(karmaField).append(kChildren[1]);

  var tableCell = $(".title")[1];
  $(tableCell).after(buildHNChartHtml());

  var table = $(tableCell).parent().parent().parent();
  $(table).attr('width', '100%');
}

function buildJSFunction() {
  var functionString = '';

  functionString += 'var elem = document.getElementById("1selfFrame");';
  functionString += 'if (elem.getAttribute("style") === "display:none;") { elem.setAttribute("style", "display:block;") }';
  functionString += 'else { elem.setAttribute("style", "display:none;") }';
  // functionString += 'document.getElementById("1selfFrame").setAttribute("style", "display:none;")';

  return functionString;
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
  chartHtml += '<div class="module trends"><div class="flex-module">';
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

function insertInstagram(instagramUrl, theTweet, page) {

  var father = theTweet.parent();
  var grandfather = father.parent();

  var instagramUrlImage = instagramUrl; // + "media/?size=l";

  // alert(father.html());
  // alert(theTweet.html());


  var embeddedMediaHtml = buildEmbeddedMedia(instagramUrlImage, page);
  
  if (page === 'main') {
    var timeStampEl = father.find("a.tweet-timestamp");
    var idUrl = timeStampEl.attr('href');
    var timestamp = timeStampEl.attr('title');

    var expandedContentHtml = buildExpandedContentHtml(timestamp, idUrl);
    var footerHtml = buildFooterHtml(idUrl);

    theTweet.siblings(".expanded-content").append(expandedContentHtml);
    theTweet.siblings(".stream-item-footer").prepend(footerHtml);
  }

  theTweet.after(embeddedMediaHtml);

  var gfClass = grandfather.attr("class");

  if (page === 'main') {
    gfClass += ' has-cards has-native-media with-media-forward auto-expanded media-forward';
    grandfather.removeAttr("data-expanded-footer");
  } else if (page === 'profile') {
    gfClass += ' has-cards is-actionable';
  } 

  grandfather.attr("class", gfClass);
  grandfather.attr("data-has-native-media", "true");
  grandfather.attr("data-has-cards", "true");
  grandfather.attr("data-card-type", "photo");
}


function buildEmbeddedMedia(instagramUrlImage, page) {
	var embeddedMedia = '';
	
  if (page === 'main') {
  	embeddedMedia += '        <div class="cards-media-container js-media-container">';
    embeddedMedia += '     	<div data-card-url="//twitter.com/ManeeshJuneja/status/560525882922901504/photo/1" ';
    embeddedMedia += '         		data-card-type="photo" class="cards-base cards-multimedia" data-element-context="platform_photo_card">';


    embeddedMedia += '  				<a class="media media-thumbnail twitter-timeline-link media-forward is-preview " ';
    embeddedMedia += '  					data-url="' + instagramUrlImage + '" ';
    embeddedMedia += '  					data-resolved-url-large="' + instagramUrlImage + '" ';
    embeddedMedia += '  					href="//twitter.com/ManeeshJuneja/status/560525882922901504/photo/1">';

    embeddedMedia += '    				<div class=" is-preview">';
              
    embeddedMedia += '    					<img src="' + instagramUrlImage + '" width="100%" alt="Embedded image permalink" ';
    embeddedMedia += '    						style="margin-top: -74px;">';
    embeddedMedia += '    				</div>';

    embeddedMedia += '  				</a>';

    embeddedMedia += '  				<div class="cards-content">';
    embeddedMedia += '    				<div class="byline">';
          
    embeddedMedia += '    				</div>';
        
    embeddedMedia += '  				</div>';
      
    embeddedMedia += '			</div>';

    embeddedMedia += '		</div>';

  } else if (page === 'profile') {

    embeddedMedia += '          <div class="js-tweet-details-fixer tweet-details-fixer">';
    embeddedMedia += '          <div class="TwitterPhoto js-media-containerx">';
    embeddedMedia += '            <div class="TwitterPhoto-container" data-card-url="//twitter.com/QuantifiedDev/status/502400139454316544/photo/1" data-card-type="photo" data-element-context="platform_photo_card">';
    embeddedMedia += '              <div class="TwitterPhoto-media">';
    embeddedMedia += '                <a class="TwitterPhoto-link media-thumbnail twitter-timeline-link" data-url="' + instagramUrlImage + '" data-resolved-url-large="' + instagramUrlImage + '">';
    embeddedMedia += '                  <img class="TwitterPhoto-mediaSource" src="' + instagramUrlImage + '" alt="Embedded image permalink" style="margin-top: -157.0px" lazyload="1">';
    embeddedMedia += '                </a>';

    embeddedMedia += '              </div> ';
    embeddedMedia += '            </div>';
    embeddedMedia += '          </div>';
    embeddedMedia += '          <div class="js-machine-translated-tweet-container"></div>';
    embeddedMedia += '        </div>';
          
    embeddedMedia += '        <div class="ProfileTweet-contextualLink u-textUserColor">';
    embeddedMedia += '          <a class="ContextualLink js-nav js-tooltip" href="/strttn/media" title="View more photos and videos from Martin Strotton">View more photos and videos</a>';

    embeddedMedia += '        </div>';
  }

	return embeddedMedia;
}

function buildExpandedContentHtml(timestamp, idUrl) {
  var html = '';

  html += '<div class="js-tweet-details-fixer tweet-details-fixer js-hidden-from-collapse">';

  html += '      <div class="js-machine-translated-tweet-container"></div>';
  html += '      <div class="js-tweet-stats-container tweet-stats-container "></div>';

  html += '      <div class="client-and-actions">';
  html += '        <span class="metadata">';
  html += '          <span>' + timestamp + '</span>';

  html += '          · <a class="permalink-link js-permalink js-nav" href="' + idUrl + '" tabindex="-1">Details</a>  ';

  html += '        </span>';
  html += '      </div>';

  html += '</div>';

  return html;
}

function buildFooterHtml(idUrl) {
  var html = '';

  html += '<a class="details with-icn js-details" href="' + idUrl + '">';
  html += '    <span class="Icon Icon--photo"></span>';

  html += '  <b>';
  html += '    <span class="expand-stream-item js-view-details">';
  html += '      Expand';
  html += '    </span>';
  html += '    <span class="collapse-stream-item  js-hide-details">';
  html += '      Collapse';
  html += '    </span>';
  html += '  </b>';
  html += '</a>';

  return html;
}