


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
  var chartHtml = '';
  chartHtml += '<td rowspan="92" align="right" valign="top">';
  chartHtml += '<div id="1selfFrame" style="display:block">';
  chartHtml += buildChartHtml('internet,social-network,hackernews', 'sample', 'max(points)', 'daily', 'barchart', 'ff6600', "70", "500"); 
  chartHtml += '</div>';
  chartHtml += '</td>';
  return chartHtml;
}

https://app.1self.co/v1/users/m/events/internet,social-network,hackernews/karma,reputation,sample/max(points)/daily/barchart?shareToken=ebd98ba6a0ae5ccaf8e659bb9fe2cb9a43266aff2eb9e174f0e61f69b0d84b00&bgColor=00a2d4&from=2015-03-08T00:00:00.000Z&to=2015-03-14T23:59:59.999Z
// https://app.1self.co/v1/users/m/events/internet,social-network,hackernews/karma,reputation,sample/max(points)/daily/barchart?shareToken=5a724759edd37d97a2989ab9fb2b6d92df78f53cb89c06dae96e5b360226c1dd&bgColor=00a2d4&from=2015-03-08T00:00:00.000Z&to=2015-03-14T23:59:59.999Z

function buildTwitterChartHtml() {
  var colour = rgbStringToHex($('.DashboardProfileCard-statValue').css('color'));
  // rgb(0, 173, 135)
  
  //<span class="DashboardProfileCard-statValue" data-is-compact="false">579</span>
  var chartHtml = '';
  chartHtml += '<div class="module trends"><div class="flex-module">';
  chartHtml += buildChartHtml('internet,social-network,twitter,social-graph,inbound,follower', 'sample', 'max(count)', 'daily', 'barchart', colour, "100%", "500");
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

function buildChartHtml(objString, actionString, aggregation, period, chartType, bgColor, width, height) {

  var chartHtml = '';
  var username;

  username = 'm';

  chartHtml += '<iframe width="' + width + '%" height="' + height + '" ';
  chartHtml += 'src="https://app.1self.co/v1/users/' + username + '/events/';
  chartHtml += objString;
  chartHtml += '/' + actionString + '/' + aggregation + '/' + period + '/' + chartType + '?bgColor=' + bgColor + '" />';

  return chartHtml;
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

/*
<p class="js-tweet-text tweet-text" lang="en" data-aria-label-part="0">
  An exciting day in Seattle. Waving our Hawks colors! 
  <a href="/hashtag/GoHawks?src=hash" data-query-source="hashtag_click" class="twitter-hashtag pretty-link js-nav" dir="ltr">
  <s>#</s><b>GoHawks</b></a>! 
  <a href="http://t.co/kw0biH75GI" rel="nofollow" dir="ltr" 
    data-expanded-url="http://instagram.com/p/ykvzdYjeby/" class="twitter-timeline-link" target="_blank" 
    title="http://instagram.com/p/ykvzdYjeby/">
      <span class="tco-ellipsis"></span>
      <span class="invisible">http://</span>
      <span class="js-display-url">instagram.com/p/ykvzdYjeby/</span>
      <span class="invisible"></span>
      <span class="tco-ellipsis">
        <span class="invisible">&nbsp;</span>
      </span>
  </a>
</p>

http://photos-a.ak.instagram.com/hphotos-ak-xfa1/t51.2885-15/914497_828711770501368_643310224_n.jpg
http://photos-a.ak.instagram.com/hphotos-ak-xfa1/t51.2885-15/914497_828711770501368_643310224_n.jpg

*/


/*

<li class="js-stream-item stream-item stream-item expanding-stream-item" data-item-id="560525882922901504" id="stream-item-tweet-560525882922901504" data-item-type="tweet"><div class="tweet original-tweet js-stream-tweet js-actionable-tweet js-profile-popup-actionable js-original-tweet        has-cards  has-native-media  with-media-forward    auto-expanded     media-forward          focus" data-tweet-id="560525882922901504" data-disclosure-type="" data-item-id="560525882922901504" data-screen-name="ManeeshJuneja" data-name="Maneesh Juneja" data-user-id="416646214" data-has-native-media="true" data-has-cards="true" data-card-type="photo" data-mentions="KatieBoehret" data-you-follow="true" data-you-block="false">

    <div class="context">
      
      
      
      
      
    </div>
    <div class="content">

      
      <div class="stream-item-header">
        
          <a class="account-group js-account-group js-action-profile js-user-profile-link js-nav" href="/ManeeshJuneja" data-user-id="416646214">
    <img class="avatar js-action-profile-avatar" src="https://pbs.twimg.com/profile_images/3685175842/ff637e4fae8c2baa7c2ef06117a462cb_bigger.jpeg" alt="">
    <strong class="fullname js-action-profile-name show-popup-with-id" data-aria-label-part="">Maneesh Juneja</strong>
    <span>‏</span><span class="username js-action-profile-name" data-aria-label-part=""><s>@</s><b>ManeeshJuneja</b></span>
    
  </a>

        <small class="time">
  <a href="/ManeeshJuneja/status/560525882922901504" class="tweet-timestamp js-permalink js-nav js-tooltip" title="7:52 PM - 28 Jan 2015"><span class="_timestamp js-short-timestamp js-relative-timestamp" data-time="1422474759" data-time-ms="1422474759000" data-long-form="true" aria-hidden="true">11m</span><span class="u-hiddenVisually" data-aria-label-part="last">11 minutes ago</span></a>
</small>

        
      </div>

      
        <p class="js-tweet-text tweet-text" lang="en" data-aria-label-part="0">
        	<a href="/hashtag/wearabletech?src=hash" data-query-source="hashtag_click" class="twitter-hashtag pretty-link js-nav" dir="ltr">
        		<s>#</s><b>wearabletech</b>
        	</a> that can help relieve back pain? by 
        	<a href="/KatieBoehret" class="twitter-atreply pretty-link" dir="ltr"><s>@</s><b>KatieBoehret</b>
        	</a>
        	<a href="http://t.co/wZHcn1mSkK" rel="nofollow" dir="ltr" 
        		data-expanded-url="http://recode.net/2015/01/28/a-tech-solution-for-stinging-back-pain/" 
        		class="twitter-timeline-link" target="_blank" 
        		title="http://recode.net/2015/01/28/a-tech-solution-for-stinging-back-pain/">
        		<span class="tco-ellipsis"></span>
        		<span class="invisible">http://</span>
        		<span class="js-display-url">recode.net/2015/01/28/a-t</span>
        		<span class="invisible">ech-solution-for-stinging-back-pain/</span>
        		<span class="tco-ellipsis"><span class="invisible">&nbsp;</span>…</span>
        	</a> 
        	<a href="http://t.co/QbTlALKBRI" class="twitter-timeline-link u-hidden" data-pre-embedded="true" dir="ltr">pic.twitter.com/QbTlALKBRI</a>
        </p>





      
        <div class="cards-media-container js-media-container">
         	<div data-card-url="//twitter.com/ManeeshJuneja/status/560525882922901504/photo/1" 
         		data-card-type="photo" class="cards-base cards-multimedia" data-element-context="platform_photo_card">


  				<a class="media media-thumbnail twitter-timeline-link media-forward is-preview " 
  					data-url="https://pbs.twimg.com/media/B8djUaKCEAA7H53.jpg:large" 
  					data-resolved-url-large="https://pbs.twimg.com/media/B8djUaKCEAA7H53.jpg:large" 
  					href="//twitter.com/ManeeshJuneja/status/560525882922901504/photo/1">

    				<div class=" is-preview">
          
    					<img src="https://pbs.twimg.com/media/B8djUaKCEAA7H53.jpg" width="100%" alt="Embedded image permalink" 
    						style="margin-top: -74px;">
    				</div>

  				</a>

  				<div class="cards-content">
    				<div class="byline">
      
    				</div>
    
  				</div>
  
			</div>

		</div>




  <div class="expanded-content js-tweet-details-dropdown">
    <div class="js-tweet-details-fixer tweet-details-fixer js-hidden-from-collapse">




  <div class="js-machine-translated-tweet-container"></div>
    <div class="js-tweet-stats-container tweet-stats-container "></div>

  <div class="client-and-actions">
  <span class="metadata">
    <span>7:52 PM - 28 Jan 2015</span>

       · <a class="permalink-link js-permalink js-nav" href="/ManeeshJuneja/status/560525882922901504" tabindex="-1">Details</a>
    

        
        
        

  </span>
</div>


</div>

  </div>


      
      <div class="stream-item-footer">
    
 -----------------     
<a class="details with-icn js-details" href="/ManeeshJuneja/status/560525882922901504">
    <span class="Icon Icon--photo"></span>

  <b>
    <span class="expand-stream-item js-view-details">
      Expand
    </span>
    <span class="collapse-stream-item  js-hide-details">
      Collapse
    </span>
  </b>
</a>
--------------------

  
        
    <span class="ProfileTweet-action--reply u-hiddenVisually">
      
      <span class="ProfileTweet-actionCount" aria-hidden="true" data-tweet-stat-count="0">
        <span class="ProfileTweet-actionCountForAria">0 replies</span>
      </span>
    </span>
    <span class="ProfileTweet-action--retweet u-hiddenVisually">
      <span class="ProfileTweet-actionCount" aria-hidden="true" data-tweet-stat-count="0">
        <span class="ProfileTweet-actionCountForAria">0 retweets</span>
      </span>
    </span>
    <span class="ProfileTweet-action--favorite u-hiddenVisually">
      <span class="ProfileTweet-actionCount" aria-hidden="true" data-tweet-stat-count="0">
        <span class="ProfileTweet-actionCountForAria">0 favorites</span>
      </span>
    </span>
  <div role="group" aria-label="Tweet actions" class="ProfileTweet-actionList u-cf js-actions buffer-inserted pocket-inserted">
  
  <div class="ProfileTweet-action ProfileTweet-action--reply">
    <button class="ProfileTweet-actionButton u-textUserColorHover js-actionButton js-actionReply js-tooltip" data-modal="ProfileTweet-reply" type="button" title="Reply">
      <span class="Icon Icon--reply"></span>
      <span class="u-hiddenVisually">Reply</span>
        <span class="ProfileTweet-actionCount u-textUserColorHover ProfileTweet-actionCount--isZero">
          <span class="ProfileTweet-actionCountForPresentation" aria-hidden="true"></span>
        </span>
    </button>
  </div>

  
  <div class="ProfileTweet-action ProfileTweet-action--retweet js-toggleState js-toggleRt">
    <button class="ProfileTweet-actionButton  js-actionButton js-actionRetweet js-tooltip" title="Retweet" data-modal="ProfileTweet-retweet" type="button">
      <span class="Icon Icon--retweet"></span>
      <span class="u-hiddenVisually">Retweet</span>
        <span class="ProfileTweet-actionCount ProfileTweet-actionCount--isZero">
          <span class="ProfileTweet-actionCountForPresentation" aria-hidden="true"></span>
        </span>
    </button><button class="ProfileTweet-actionButtonUndo js-actionButton js-actionRetweet js-tooltip" data-modal="ProfileTweet-retweet" title="Undo retweet" type="button">
      <span class="Icon Icon--retweet"></span>
      <span class="u-hiddenVisually">Retweeted</span>
        <span class="ProfileTweet-actionCount ProfileTweet-actionCount--isZero">
          <span class="ProfileTweet-actionCountForPresentation" aria-hidden="true"></span>
        </span>
    </button>
  </div><div class="action-pocket-container"><a class="ProfileTweet-action js-tooltip" href="#" data-original-title="Save to Pocket"><span class="icon icon-pocket" style="background-image: url(https://d2jjx1cmnmp22i.cloudfront.net/safari/twttr-sprite@1x.png) !important;"></span></a></div><div class="action-buffer-container"><a class="ProfileTweet-action js-tooltip" href="#" data-original-title="Add to Buffer"><span class="icon icon-buffer"></span></a></div>

  
  <div class="ProfileTweet-action ProfileTweet-action--favorite js-toggleState">
    <button class="ProfileTweet-actionButton js-actionButton js-actionFavorite js-tooltip" title="Favorite" type="button">
      <span class="Icon Icon--favorite"></span>
      <span class="u-hiddenVisually">Favorite</span>
        <span class="ProfileTweet-actionCount ProfileTweet-actionCount--isZero">
            <span class="ProfileTweet-actionCountForPresentation" aria-hidden="true"></span>
        </span>
    </button><button class="ProfileTweet-actionButtonUndo u-linkClean js-actionButton js-actionFavorite js-tooltip" title="Undo favorite" type="button">
      <span class="Icon Icon--favorite"></span>
      <span class="u-hiddenVisually">Favorited</span>
        <span class="ProfileTweet-actionCount ProfileTweet-actionCount--isZero">
            <span class="ProfileTweet-actionCountForPresentation" aria-hidden="true"></span>
        </span>
    </button>
  </div>

  
    <div class="ProfileTweet-action ProfileTweet-action--more js-more-ProfileTweet-actions">
      <div class="dropdown">
  <button class="ProfileTweet-actionButton u-textUserColorHover dropdown-toggle js-tooltip js-dropdown-toggle" type="button" title="More" aria-haspopup="true">
      <span class="Icon Icon--dots"></span>
      <span class="u-hiddenVisually">More</span>
  </button>
  <div class="dropdown-menu">
  <div class="dropdown-caret">
    <div class="caret-outer"></div>
    <div class="caret-inner"></div>
  </div>
  <ul>
    
      <li class="share-via-dm js-actionShareViaDM" data-nav="share_tweet_dm">
        <button type="button" class="dropdown-link">Share via Direct Message</button>
      </li>
    
      <li class="share-via-email js-actionShareViaEmail" data-nav="share_tweet">
        <button type="button" class="dropdown-link">Share via email</button>
      </li>
        <li class="embed-link js-actionEmbedTweet" data-nav="embed_tweet">
          <button type="button" class="dropdown-link">Embed Tweet</button>
        </li>
          <li class="mute-user-item pretty-link"><button type="button" class="dropdown-link">Mute</button></li>
  <li class="unmute-user-item pretty-link"><button type="button" class="dropdown-link">Unmute</button></li>

          <li class="block-or-report-link js-actionBlockOrReport" data-nav="block_or_report">
            <button type="button" class="dropdown-link">Block or report</button>
          </li>
  </ul>
</div>

</div>

    </div>

  
</div>


</div>

      

      

    </div>
  </div></li>

  */