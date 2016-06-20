const presetNames = ["freecodecamp", "comster404"];
const liveStreamers = 5;
let masterArr = [];

$(document).ready(function () {
   $('#logo-box').bigtext();
   fetchStreamsFromNames(presetNames, processDataFromNames);

   $("#input-form").submit(function (event) {
      let userInput = encodeURIComponent($("#input-text").val());
      fetchStreamFromInput(userInput, processDataFromInput);
      event.preventDefault();
   });
   $("#input-button").click(function (event) {
      let userInput = encodeURIComponent($("#input-text").val());
      fetchStreamFromInput(userInput, processDataFromInput);
      event.preventDefault();
   });
   
   $("#sort-button").click(function (event) {
      if (this.value === "views") {
         $("#sort-button").html("Sorting by: Name");
         sortByName(displayMasterArr);
         this.value = "name";
      }
      else {
         $("#sort-button").html("Sorting by: Views");
         sortByOrder(displayMasterArr);
         this.value = "views";
      }
      
   });


});

$(window).load(function () {
   centerLogo();
});

let resizeId;
$(window).resize(function () {
   clearTimeout(resizeId);
   resizeId = setTimeout(doneResizing, 200); // sets the milliseconds to wait before completing resizing functions
});

function doneResizing() {
   // All the functions you want to execute after resize go here
   centerLogo();
}

function centerLogo() {
   let logoHeight = $('#logo-box').outerHeight();
   let wrapperHeight = $('.js-img-height').outerHeight();
   $('#logo-box').css({
      'margin-top': (wrapperHeight - logoHeight) * 0.48
   });
}

function fetchStreamsFromNames(nameArr, processDataFromNames) {
   let arrFromNames = [];
   let countdown = nameArr.length;
   nameArr.forEach(function (name) {
      $.ajax({
         url: "https://api.twitch.tv/kraken/streams/" + name,
         dataType: 'jsonp',
         success: function (data) {
            let obj = {};
            obj.name = name;
            obj.data = data;
            arrFromNames.push(obj);
            countdown--;
            if (countdown === 0) {
               processDataFromNames(arrFromNames, fetchStreamsFromLive);
            }
         }
      });
   });
}

function processDataFromNames(arrFromNames, fetchStreamsFromLive) {
   arrFromNames.forEach(function (fetchedName) {
      let obj = {};
      obj.name = fetchedName.name;
      if (_.has(fetchedName.data.stream, 'preview')) {
         obj.status = fetchedName.data.stream.channel.status;
         obj.link = fetchedName.data.stream.channel.url;
         obj.viewers = fetchedName.data.stream.viewers;
         obj.order = fetchedName.data.stream.viewers;
         obj.image = fetchedName.data.stream.preview.large;
      }
      else if (fetchedName.data.stream === null) {
         obj.status = "Offline";
         obj.link = "https://www.twitch.tv/" + fetchedName.name;
         obj.viewers = 0;
         obj.order = 0;
         obj.image = `public/twitchlist-offline-${_.random(1, 9)}.jpg`;
      }
      else {
         obj.status = "Account closed or nonexistent";
         obj.link = "https://www.twitch.tv/" + fetchedName.name;
         obj.viewers = 0;
         obj.order = -1;
         obj.image = `public/twitchlist-closed-${_.random(1, 9)}.jpg`;
      }
      masterArr.push(obj);
   });
   fetchStreamsFromLive(processDataFromLive);
}

function fetchStreamsFromLive(processDataFromLive) {
   $.getJSON(`https://api.twitch.tv/kraken/streams?stream_type=live&limit=${liveStreamers}&language=en&callback=?`, function (data) {
      processDataFromLive(data.streams, fetchStreamFromInput);
   });
}

function processDataFromLive(dataArr, fetchStreamFromInput) {
   let countdown = dataArr.length;
   dataArr.forEach(function (data) {
      let obj = {};
      obj.name = data.channel.name;
      obj.status = data.channel.status;
      obj.link = data.channel.url;
      obj.viewers = data.viewers;
      obj.order = data.viewers;
      obj.image = data.preview.large;
      masterArr.push(obj);
      countdown--;
      if (countdown === 0) {
         sortByOrder(displayMasterArr);
      }
   });

}

function fetchStreamFromInput(userInput, processDataFromInput) {
   let arrFromNames = [];
   if (userInput != "") {
      $.ajax({
         url: "https://api.twitch.tv/kraken/streams/" + userInput,
         dataType: 'jsonp',
         success: function (data) {
            let obj = {};
            obj.name = userInput;
            obj.data = data;
            arrFromNames.push(obj);
            processDataFromInput(arrFromNames, sortByOrder);
         }
      });
   }
}

function processDataFromInput(arrFromNames, sortByOrder) {
   arrFromNames.forEach(function (fetchedName) {
      let obj = {};
      obj.name = fetchedName.name;
      if (_.has(fetchedName.data.stream, 'preview')) {
         obj.status = fetchedName.data.stream.channel.status;
         obj.link = fetchedName.data.stream.channel.url;
         obj.viewers = fetchedName.data.stream.viewers;
         obj.order = fetchedName.data.stream.viewers;
         obj.image = fetchedName.data.stream.preview.large;
      }
      else if (fetchedName.data.stream === null) {
         obj.status = "Offline";
         obj.link = "https://www.twitch.tv/" + fetchedName.name;
         obj.viewers = 0;
         obj.order = 0;
         obj.image = `public/twitchlist-offline-${_.random(1, 9)}.jpg`;
      }
      else {
         obj.status = "Account closed or nonexistent";
         obj.link = "https://www.twitch.tv/" + fetchedName.name;
         obj.viewers = 0;
         obj.order = -1;
         obj.image = `public/twitchlist-closed-${_.random(1, 9)}.jpg`;
      }
      masterArr.push(obj);
      sortByOrder(displayMasterArr);
   });
}

function sortByOrder(displayMasterArr) {
   let sortedArr = _.orderBy(masterArr, ['order', 'name'], ['desc', 'asc']);
   displayMasterArr(sortedArr);
}

function sortByName(displayMasterArr) {
   let sortedArr = _.orderBy(masterArr, ['name', 'order'], ['asc', 'desc']);
   displayMasterArr(sortedArr);
}

function displayMasterArr(sortedArr) {
   $("#streams-parent").empty(); // empties the previous results
   $.each(sortedArr, function (index, obj) {
      $("#streams-parent").append(`<a href="${obj.link}" target="_blank"><div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-3"><div class="card"><img class="card-img-top img-fluid" src="${obj.image}"><div class="card-block"><h4 class="card-title">${obj.name}</h4><p class="card-text"><span class="text-muted">Viewers:&nbsp;</span>${obj.viewers}<br/><span class="text-muted">Status:&nbsp;</span>${obj.status}</p></div></div></div></a>`);
   });
}
