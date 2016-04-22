//app.js for the Mars Site Vote project.

// By Aaron Filson

//The first version of the project will have the user of the site click
//on an image to vote for where to land a mission to Mars.
var ImgObj = function (pImgFileLoc){
  this.fileNameForImg = pImgFileLoc;
  this.numberOfVotes = 0;
};

//gobal vars
var imgFileLocations = [
  "img/658668main_pia15685-full_full.jpg",
  "img/658682main_pia15686_full.jpg",
  "img/667877main_Grotzinger-1PIA15690_800-600.jpg",
  "img/675225main_pia16029-43_800-600.jpg",
  "img/676026main_pia16052-color-43_800-600.jpg",
  "img/676039main_pia16053-color-43_800-600.jpg",
  "img/678276main_pia16077-43_800-600.jpg",
  "img/734386main_pia16768-43_800-600.jpg",
  "img/PIA17766-800x600.jpg",
  "img/PIA17946-800x600.jpg",
  "img/PIA18083-800x600.jpg",
  "img/PIA19803-800x600.jpg",
  "img/PSP_008579_9020_descent_800-600.jpg",
  "img/glacialcraters_mro.jpg"
];
var didReset = true;
var whichSitesNow = [0 , 1];
var imgArray = [];
for (var i = 0; i < imgFileLocations.length; i++) {
  imgArray[i] = new ImgObj(imgFileLocations[i]);
}

var VoteTracker = function() {
  this.findTagOne = document.getElementById('clickOne');
  this.findTagTwo = document.getElementById('clickTwo');
  this.resetP = document.getElementById('resetP');

  this.displayImg = function () {
    whichSitesNow = this.randomPickTwo();
    this.point1 = this.findTagOne.appendChild(document.createElement('div'));
    this.point2 = this.findTagTwo.appendChild(document.createElement('div'));
    this.point1.innerHTML = "<img src=\'" + imgArray[whichSitesNow[0]].fileNameForImg + "\' alt='The first site to consider' title='This is the first landing site to consider for a mission to Mars. Click on the image to vote in favor.' \>";
    this.point2.innerHTML = "<img src=\'" + imgArray[whichSitesNow[1]].fileNameForImg + "\' alt='The second site to consider' title='This is the second landing site to consider for a mission to Mars. Click on the image to vote in favor.' \>";
    this.point1.addEventListener('click', this.handleImgClicks);
    this.point2.addEventListener('click', this.handleImgClicks);

  };
  this.displayImg();
};

VoteTracker.prototype.makeChart = function () {
  var ctx = document.getElementById('voteChart').getContext("2d");
  var data = { //beware, hardcoded to 14 landing sites
    labels: ['Site1', 'Site2', 'Site3', 'Site4', 'Site5', 'Site6', 'Site7', 'Site8','Site9', 'Site10', 'Site11', 'Site12', 'Site13', 'Site14'],
    datasets: [
      {
        label: "Voting Set One, Round One",
        fillColor: "#0d0d0d",
        strokeColor: "#5ab8f3",
        highlightFill: "#a0e3f2",
        highlightStroke: "#2a558c",
        data: []
      },
    ]
  };
  var outgoing = this.populateChartData(data);
  var options = {};
  var voteChart = new Chart(ctx).Bar(outgoing, options);
};

VoteTracker.prototype.populateChartData = function (pData) {
  for (var i = 0; i < imgArray.length; i++) {
    pData.datasets[0].data[i] = imgArray[i].numberOfVotes;
  };
  return pData;
}

VoteTracker.prototype.handleImgClicks = function (event) {
  var tagHandle = (event.currentTarget.parentElement.id == 'clickOne') ? 0 : 1;
  var ser = whichSitesNow[tagHandle];
  if(didReset) {
    imgArray[ser].numberOfVotes++;
    didReset = false;
    event.currentTarget.parentElement.className = 'highlight';
  }
  raiseTheChartFlag();
  handleTheReset(event);
};

VoteTracker.prototype.randomPickTwo = function () {
  var j = Math.ceil(Math.random()*(imgFileLocations.length - 1));
  var k;
  do{
    var loop = false;
    if ((k = (Math.floor(Math.random()*(imgFileLocations.length)))) == j) {
      loop = true; //if they match, loop and try again.
    } else {
      return [j, k]; //return the two indexes of random sites to land at.
    }
  } while (loop);
};

VoteTracker.prototype.storeData = function (ev) {
  localStorage.setItem('superKey', JSON.stringify(imgArray));
};

VoteTracker.prototype.retrieveData = function(ev) {
  var temp = localStorage.getItem('superKey');
  if(temp != 'null') {
    imgArray = JSON.parse( temp );
  }
  raiseTheChartFlag();
};

VoteTracker.prototype.resetData = function (ev){
  document.getElementById('confirmButton').className = null;
  document.getElementById('cancel').className = null;
};

VoteTracker.prototype.confirmData = function (ev) {
  localStorage.setItem('superKey', 'null');
  document.getElementById('confirmButton').className = "hidden";
  document.getElementById('cancel').className = "hidden";
};

VoteTracker.prototype.cancelReset = function (ev) {
  document.getElementById('confirmButton').className = "hidden";
  document.getElementById('cancel').className = "hidden";
};

function handleTheReset (event) {
  didReset = true;
  document.getElementById('clickOne').innerHTML = null;
  document.getElementById('clickOne').className = null;
  document.getElementById('clickTwo').innerHTML = null;
  document.getElementById('clickTwo').className = null;
  pageOneTracker.displayImg();
}

function raiseTheChartFlag() {
  pageOneTracker.makeChart();
}

//make the object, it calls all of the other constructors
var pageOneTracker = new VoteTracker();
//add listeners to the elements we want to get events from
pageOneTracker.point1.addEventListener('click', pageOneTracker.handleImgClicks);
pageOneTracker.point2.addEventListener('click', pageOneTracker.handleImgClicks);

document.getElementById('storeButton').addEventListener('click', pageOneTracker.storeData);
document.getElementById('retrieveButton').addEventListener('click', pageOneTracker.retrieveData);
document.getElementById('resetButton').addEventListener('click', pageOneTracker.resetData);
document.getElementById('confirmButton').addEventListener('click', pageOneTracker.confirmData);
document.getElementById('cancel').addEventListener('click', pageOneTracker.cancelReset);
