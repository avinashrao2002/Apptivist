var db = firebase.firestore();
var storage = firebase.storage();

totalPosts = 0

var myUser = localStorage['myUser'] || 'N/A';
var userToView = localStorage['userToView'] || myUser;
var cachedPfp = localStorage["cachedPfp"] || "https://firebasestorage.googleapis.com/v0/b/protestapp-599ff.appspot.com/o/default%2Fpfp_400x400.png?alt=media&token=f69b4ca5-cffe-4d36-90ec-98319bf77d6b"

var isAProduct = false



function checkIfLoggedIn(){
  if (typeof localStorage['myUser'] == undefined || localStorage['myUser'] == "N/A") {
    window.location.href = "login_signup.html";
  }
}


async function test() {
  var signupemail = document.getElementById("field1").value;
  var signuppass = document.getElementById("field5").value;

  let data = {
    
    email: signupemail,
    firstName: document.getElementById("field2").value,
    isOrganization: false,
    lastName: document.getElementById("field4").value,
    userName: document.getElementById("field6").value,
    bio: "I am new to Apptivism!",
    pfp: "https://firebasestorage.googleapis.com/v0/b/protestapp-599ff.appspot.com/o/default%2Fpfp_400x400.png?alt=media&token=f69b4ca5-cffe-4d36-90ec-98319bf77d6b",
    followers: [document.getElementById("field6").value],
    following: [document.getElementById("field6").value],
    postNumber: 0

  };
  
var errorDetermine = await db.collection('users').where("userName", "==", document.getElementById("field6").value).get()
var fmap = errorDetermine.docs.map(doc => doc.data())
console.log(fmap)

if (fmap.length>0 ) {
  window.alert("That username is already taken, sorry!")
  return "broke"
}

if (document.getElementById("field6").value.includes(".") || document.getElementById("field6").value.includes(":")){
  window.alert("Usernames cannot have : or .")
  return "broke"
}
  // Add a new document in collection "cities" with ID 'LA'
  db.collection('users').doc(document.getElementById("field6").value).set(data);
  

  await firebase.auth().createUserWithEmailAndPassword(signupemail, signuppass).catch(function(error) {
    // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert("Error : " + errorMessage);
    // ...
    
 
  });  
  localStorage["myUser"] = data.userName
  localStorage["cachedPfp"] = "https://firebasestorage.googleapis.com/v0/b/protestapp-599ff.appspot.com/o/default%2Fpfp_400x400.png?alt=media&token=f69b4ca5-cffe-4d36-90ec-98319bf77d6b"

}
function hidePostBox(){
  
document.getElementById("makePost").style.display = "none";
}
function showPostBox(){
document.getElementById("makePost").style.display = "block";
}
async function createPost(link,num,tex){
  d = new Date()
  n = d.getTime()
  var storageRef = storage.ref();

  var pfpLink = await storageRef.child(myUser + "/" + myUser + "pfp" + "_400x400").getDownloadURL().catch(async function handl() {
    buzz = await storageRef.child("default" + "/" +  "pfp_400x400.png").getDownloadURL()

  })
  let data = {
    imageLink: link,
    postNumber: num,
    text: tex,
    handle: myUser,
    created: n/1000,
    pfp: pfpLink || buzz,
    isProduct: isAProduct,
    likes: [myUser]
  }
  //document.getElementById("makePost").style.display = "block";
  db.collection('posts').doc(myUser + String(num)).set(data);

}

async function submitPost() {
  
  var storageRef = storage.ref();

  console.log("In submit post, total posts is " + totalPosts)
  await storageRef.child(myUser + '/' + myUser + String(totalPosts + 1) + "_400x400").getDownloadURL().then(function(url) {
  var imageLink = url  
  console.log('this far')
  console.log(url)

  createPost(imageLink, totalPosts + 1, document.getElementById("postText").value)
  data = {
    postNumber: totalPosts + 1
  }
  db.collection('users').doc(myUser).update(data)
  document.getElementById("postText").value = ""
  hidePostBox()
  location.reload()

}).catch(function(error) {

});
}

function create_user(){
  var a = document.getElementById("field1").value;
  var b = document.getElementById("field2").value;
  var c = false
  var d = document.getElementById("field4").value;
  var e = document.getElementById("field5").value;
  var f = document.getElementById("field6").value;

  function writeUserData(a, b, c, d, e, f) {
    firebase.database().ref('users/' + f).set({
      email: a,
      firstName: b,
      isOrganization: c,
      lastName: d,
      password: e,
      userName: f
    });
  }
}


firebase.auth().onAuthStateChanged(async function(user) {
    if (user) {
      // User is signed in.

      document.getElementById("create_account").style.display = "block";
      document.getElementById("user_div").style.display = "block";
      document.getElementById("login_div").style.display = "none";


      const loginMap = await db.collection("users").where("email", "==", firebase.auth().currentUser.email).get()
      const loginData = loginMap.docs.map(doc => doc.data())
      myUser = loginData[0].userName
      localStorage['myUser'] = loginData[0].userName;
      console.log(myUser)

      
      if(user != null){
  
        var email_id = user.email;
        document.getElementById("user_para").innerHTML = "Welcome User : " + email_id;
  
      }
  
    } else {
      // No user is signed in.
  
      document.getElementById("user_div").style.display = "none";
      document.getElementById("create_account").style.display = "block";
      document.getElementById("login_div").style.display = "block";
      document.getElementById("signup_div").style.display = "block";
    }
    findProfile()
  });
  
  async function login(){
  
    var userEmail = document.getElementById("email_field").value;
    var userPass = document.getElementById("password_field").value;
  
    await firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
  
      window.alert("Error : " + errorMessage);
  
      // ...

    });

    
  }
  
  function logout(){
    firebase.auth().signOut();
    localStorage['myUser'] = undefined;
    window.location.href = "login_signup.html";
  }


  

//PROFILE SECTION

async function retrieveMyPosts(user){
    var allPosts = []
    var timestampArray = []
    //const snapFollow = await firebase.firestore().collection('users').doc("avinash_rao05").collection("following").get()
    //const followingArray = snapFollow.docs.map(doc => doc.data())
  
    //var userNameArray = []
  
   // for (x=0; x<followingArray.length;x++){
      //userNameArray.push(followingArray[x].userName)
    //}
  


 
    const snapshot = await firebase.firestore().collection('posts').where("handle", "==", user).get()
    const array = snapshot.docs.map(doc => doc.data())
    allPosts.push(array)
    console.log(allPosts)
  console.log("madeIt")
    //for (element in array){
      //allPosts.push(element)
    var allPosts = [].concat.apply([], allPosts)
  
    for(q=0;q<allPosts.length;q++){
      timestampArray.push(allPosts[q].created)
    }
    
    var dictionaryArray = []
    for(q=0;q<allPosts.length;q++){
      dictionaryArray.push({
        key:allPosts[q],
        value: allPosts[q].created})
    }
  
    dictionaryArray.sort(function(a,b) {
      return b.value - a.value
  });
  

      for(q=0;q<dictionaryArray.length;q++){
        //var userData = await db.collection("users").doc(user).get()
        //var linktopfp = userData.data().pfp
        if (dictionaryArray[q].key.likes.includes(myUser)){
          btnColor = "#EAC2C2"
        }
        else {
          btnColor = "#EAEEED"
        }

      addToTable(dictionaryArray[q].key.imageLink,dictionaryArray[q].key.text, dictionaryArray[q].key.handle, dictionaryArray[q].key.pfp, dictionaryArray[q].key.created, dictionaryArray[q].key.postNumber, dictionaryArray[q].key.likes.length, btnColor, dictionaryArray[q].key)
      }
      
    }
  
  
  



class User {
  constructor (userName, firstName, lastName, postNumber ) {
      this.userName = userName;
      this.firstName = firstName;
      this.lastName = lastName;
      this.postNumber = postNumber;
  }
  toString() {
      return this.userName + ', ' + this.firstName + ', ' + this.lastName + '' + String(this.postNumber);
  }
}

  // Firestore data converter
userConverter = {
    toFirestore: function(user) {
        return {
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            postNumber: user.postNumber
            }
    },
    fromFirestore: function(snapshot, options){
        const data = snapshot.data(options);
        return new User(data.userName, data.firstName, data.lastName, data.postNumber)
    }
}
function myfunc(){

db.collection("users").doc(userToView)
  .withConverter(userConverter)
  .get().then(function(doc) {
    if (doc.exists){
      // Convert to City object
      document.getElementById("username").innerHTML = doc.data().userName;
      document.getElementById("real_name").innerHTML = doc.data().firstName + ' ' + doc.data().lastName
      // Use a City instance method
      console.log(doc.data.toString());
    } else {
      console.log("No such document!")
    }}).catch(function(error) {
      console.log("Error getting document:", error)
    });



}

function Loaded(){
  numpostRetriever();
  console.log("retrieved numPost as " +totalPosts)
}


async function numpostRetriever(){
  totalPosts = await db.collection("users").doc(myUser).get()
  totalPosts = totalPosts.data().postNumber

return totalPosts
  
  
  }


// POST SECTION
class Post {
  constructor (imageLink, postNumber, text ) {
      this.imageLink = imageLink;
      this.postNumber = postNumber;
      this.text = text;
  }
  toString() {
      return this.imageLink + ', ' + this.postNumber + ', ' + this.text;
  }
}

  // Firestore data converter
postConverter = {
    toFirestore: function(post) {
        return {
            imageLink: post.imageLink,
            postNumber: post.postNumber,
            text: post.text
            }
    },
    fromFirestore: function(snapshot, options){
        const data = snapshot.data(options);
        return new Post(data.imageLink, data.postNumber, data.text)
    }


}
//Feed System
async function followUser(user2Follow){

  var ate = await firebase.firestore().collection('users').doc(user2Follow).collection("following").doc("following").get()
const ref = await firebase.firestore().collection('users').doc(user2Follow).collection("following").doc("following")

  if (ate.data().following.includes(myUser)){
    console.log("already exists")}
  else {
  ref.update({
    following: firebase.firestore.FieldValue.arrayUnion(myUser)
  })
}

}

async function retrieveFeed() {
  var allPosts = []
  var timestampArray = []
  const snapFollow = await firebase.firestore().collection('users').doc(myUser).get()
  const followingArray = snapFollow.data().following
console.log(followingArray)



  if (followingArray.length > 0){
  var sortingArray = []
  for (a = 0; a<followingArray.length; a++){
  const snapshot = await firebase.firestore().collection('posts').where("handle", "==", followingArray[a]).get()
  const array = snapshot.docs.map(doc => doc.data())
  allPosts.push(array)

  //for (element in array){
    //allPosts.push(element)
  var allPosts = [].concat.apply([], allPosts)

  sortingArray.push(followingArray[a])
  }
  for(q=0;q<allPosts.length;q++){
    timestampArray.push(allPosts[q].created)
  }
  
  var dictionaryArray = []
  for(q=0;q<allPosts.length;q++){
    dictionaryArray.push({
      key:allPosts[q],
      value: allPosts[q].created})
  }

  dictionaryArray.sort(function(a,b) {
    return b.value - a.value
});
console.log(dictionaryArray)
  if (sortingArray.length == followingArray.length) {
    for(q=0;q<dictionaryArray.length;q++){
      if (dictionaryArray[q].key.likes.includes(myUser)){
        btnColor = "#EAC2C2"
      }
      else {
        btnColor = "#EAEEED"
      }
    addToTable(dictionaryArray[q].key.imageLink,dictionaryArray[q].key.text, dictionaryArray[q].key.handle, dictionaryArray[q].key.pfp, dictionaryArray[q].key.created, dictionaryArray[q].key.postNumber, dictionaryArray[q].key.likes.length, btnColor, dictionaryArray[q].key)
    }
    
  }

}
}



 async function addToTable(imgSource, caption, handle, pfp, timestamp, postNumber, newLikes, color, data){
  d = new Date()
  n = d.getTime()

  var tableRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];
  var reformattedDate = new Date((timestamp-25200)*1000).toUTCString()
  var indicator = " AM"
  var hour = parseInt((reformattedDate.slice(17,19)))
  if (parseInt(reformattedDate.slice(17,19)) >= 12){
    indicator = " PM"
    hour = hour - 12

  } 
  reformattedDate = reformattedDate.slice(0,17) + String(hour) + reformattedDate.slice(19,22) + indicator
  var timeInfo = document.createTextNode(reformattedDate)

  
  


// Insert a row in the table at the last row

var newRow   = tableRef.insertRow();
var pfpText = document.createTextNode(handle)
var profileImage = document.createElement("img")
var followButton = document.createElement("button")
var likeButton = document.createElement("button")
var listLikeButton = document.createElement("button")
var picandhandlediv = document.createElement("div")
var textDiv = document.createElement("div")
var spanDiv = document.createElement("span")
var commentsButton = document.createElement("button")
commentsButton.innerHTML = "View Comments"
commentsButton.classList.add("myRealButtons")

commentsButton.onclick = function(){

  readComments(handle, postNumber, data)
  commentsModal.style.display = "block";
  document.getElementById("comment").style.display = "block"
  document.getElementById("submitComment").style.display = "block"
}
spanDiv.classList.add("spanForText")

listLikeButton.innerHTML = newLikes + " &hearts;"
listLikeButton.style.backgroundColor = "#124665"

picandhandlediv.appendChild(profileImage)
picandhandlediv.appendChild(document.createTextNode("@"))
picandhandlediv.appendChild(pfpText)
picandhandlediv.onclick = function() {
  viewThisProfile(handle)
}
picandhandlediv.style.cursor = "pointer"
var datediv = document.createElement("div")
datediv.appendChild(timeInfo)
datediv.classList.add("datediv")
picandhandlediv.appendChild(datediv)
profileImage.src = pfp
followButton.innerHTML = "Follow Me"
followButton.onclick =  function _ (){
  followUser(handle)
}

likeButton.style.backgroundColor = color

likeButton.id = handle + String(postNumber)
console.log(likeButton.id)
likeButton.innerHTML = "Like"
likeButton.onclick = function __ (){
  likePost(handle, postNumber)
  
}
listLikeButton.style.color = "#EAEEED"
listLikeButton.onclick = function ___ () {
  newLikeList(handle,postNumber, data)
  commentsModal.style.display = "block";
  document.getElementById("comment").style.display = "None"
  document.getElementById("submitComment").style.display = "None"
}
//followButton.onclick = followUser(handle)

// Insert a cell in the row at index 0

var newCell  = newRow.insertCell(0);
var picCell = newRow.insertCell(1);
// Append a text node to the cell


var newText  = document.createTextNode(caption);
var likesDiv = document.createElement("div")
likesDiv.style.display = "inline"

likesDiv.appendChild(likeButton)
likesDiv.appendChild(listLikeButton)
likesDiv.appendChild(commentsButton)

spanDiv.appendChild(newText)
textDiv.appendChild(spanDiv)
textDiv.classList.add("scrollPosts")
//getting the image data and post data
newCell.appendChild(picandhandlediv)
newCell.appendChild(document.createElement("hr"));
newCell.appendChild(textDiv);
newCell.appendChild(likesDiv);
if (myUser == handle){
  var deletediv = document.createElement("div")
  deletediv.style.color = "white"
  deletediv.style.fontSize = "10px"
  deletediv.style.marginLeft = "20px"
  deletediv.style.marginTop = "20px"
  deletediv.style.cursor = "pointer"
  deletediv.innerHTML = "&#x26D4; Delete Post"
  console.log("this far")
  deletediv.onclick = function(){
    deletePost(handle, postNumber)
  }
  newCell.appendChild(deletediv)
  }
likeButton.style.marginRight = "0px"

listLikeButton.style.marginRight = "0px"

commentsButton.style.marginRight = "0px"

likeButton.classList.add("myRealButtons")
listLikeButton.classList.add("myRealButtons")

var img = document.createElement("img")

img.src = imgSource


picCell.appendChild(img)
img.classList.add("image")

//picCell.classList.add("card")
picCell.classList.add("picture")
img.onclick = function(){
  window.open(imgSource, "_blank")
}
img.style.cursor = "pointer"
newCell.classList.add("card")
profileImage.classList.add("profile-pic")
likesDiv.style.marginTop = "0px"
}
//following System

function consolelogger() {
  console.log("this worked")
}

async function likePost(user, postNumber){
var ate = await firebase.firestore().collection('posts').doc(user + postNumber).get()
const ref = await firebase.firestore().collection('posts').doc(user + postNumber)

  if (ate.data().likes.includes(myUser)){
    ref.update({
      likes: firebase.firestore.FieldValue.arrayRemove(myUser)
    })
    document.getElementById(user + String(postNumber)).style.backgroundColor = "#EAEEED"
  }
  else {
  ref.update({
    likes: firebase.firestore.FieldValue.arrayUnion(myUser)
  })
  document.getElementById(user + String(postNumber)).style.backgroundColor = "#EAC2C2"
}

  
}

async function likeNumber(user, postNumber){
  var ate = await firebase.firestore().collection('posts').doc(user + postNumber).collection("likes").doc("likers").get()
  return ate.data().likers.length
}

async function likeList(user, postNumber){

  var likes = await firebase.firestore().collection('posts').doc(user + postNumber).get()
  const likesArray = likes.data().likes
  console.log(likesArray)

  alert("these are the users who liked this post: " + likesArray)
}



function startdate(){
  var abc = document.getElementById("startdate").value
  var someDate = new Date(abc);
  someDate = someDate.getTime();
  someDate = someDate/1000
  return someDate 
}
function enddate(){
  var abd = document.getElementById("enddate").value
  var someDate = new Date(abd);
  someDate = someDate.getTime();
  someDate = someDate/1000
  return someDate 
}

  
function makeProtest(user){
  console.log(latlong)
  let data = {
    handle: user,
    name: document.getElementById("protestName").value,
    description: document.getElementById("protestDescription").value,
    location: latlong,
    startDate: startdate(),
    endDate: enddate(),
    created: new Date().getTime()/1000,
    tags: ["no tags right now!"],
    going: [myUser],
    interested: [myUser]

  }
  db.collection("events").doc(user + document.getElementById("protestName").value).set(data)

}

var userLat = 0
var userLong = 0
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    console.log("oops, something went wrong")
  }
}

function showPosition(position) {
  userLat = position.coords.latitude;
  userLong = position.coords.longitude;

}


async function retrieveProtests(){

  var allProtests = []

  const kdk = await db.collection('events').get()

  allProtests = kdk.docs.map(doc => doc.data())
console.log(allProtests)
  var dictionaryArray = []
  for(q=0;q<allProtests.length;q++){
    dictionaryArray.push({
      key:allProtests[q],
      value: allProtests[q].startDate})
  }

  dictionaryArray.sort(function(a,b) {
    return b.value - a.value
});

for(q=0;q<dictionaryArray.length;q++){

  var interested = dictionaryArray[q].key.interested.length
  var going = dictionaryArray[q].key.going.length
  var userData = await db.collection("users").doc(dictionaryArray[q].key.handle).get()
  var linktopfp = userData.data().pfp
//If clauses to see if everything exists
 addToProtests(dictionaryArray[q].key.name,dictionaryArray[q].key.description, dictionaryArray[q].key.handle, linktopfp, dictionaryArray[q].key.startDate, dictionaryArray[q].key.endDate,interested, going, dictionaryArray[q].key.location, dictionaryArray[q].key)

  }
}

async function addToProtests(name, description, handle, pfp, startDate, endDate, interested, going, location, data){
  var tableRef = document.getElementById('protestsTable').getElementsByTagName('tbody')[0];
// Insert a row in the table at the last row
var newRow   = tableRef.insertRow();


var pfpText = document.createTextNode(handle)
pfpText.onclick = function(){
  viewThisProfile(handle)
}

var profileImage = document.createElement("img")
profileImage.onclick = function(){
  viewThisProfile(handle)
}
profileImage.style.cursor = "pointer"
var wordLocation = null
var titleDiv = document.createElement("div")
profileImage.src = pfp
var lat = 0
var long = 0
lat = location[0]
long = location[1]
await $.getJSON('https://api.mapbox.com/geocoding/v5/mapbox.places/' + String(lat) + ',' + String(long) +'.json?types=poi&access_token=pk.eyJ1IjoicHJvdGVzdGFwcDgxIiwiYSI6ImNrZDR0b3NuZTA5dzEydm4xc3doaDFzNjkifQ.wM_eBlK62-STgRjqCGoJzw', function(data) {
        

  wordLocation = data.features[0].place_name
  

});

console.log(wordLocation)

var descripText  = document.createTextNode(description);
var descripDiv = document.createElement("div")
descripDiv.appendChild(descripText)
descripDiv.classList.add("scrollable")
// Insert a cell in the row at index 0
var newCell  = newRow.insertCell(0);
var descripCell  = newRow.insertCell(1);

// Append a text node to the cell
console.log(startDate)
var reformattedDate = new Date((startDate-25200)*1000).toUTCString()
  var indicator = " AM"
  var hour = parseInt((reformattedDate.slice(17,19)))
  if (parseInt(reformattedDate.slice(17,19)) >= 12){
    indicator = " PM"
    hour = hour - 12

  } 
  reformattedDate = reformattedDate.slice(0,17) + String(hour) + reformattedDate.slice(19,22) + indicator
   startDate = reformattedDate

   var reformattedDate = new Date((endDate-25200)*1000).toUTCString()
  var indicator = " AM"
  var hour = parseInt((reformattedDate.slice(17,19)))
  if (parseInt(reformattedDate.slice(17,19)) >= 12){
    indicator = " PM"
    hour = hour - 12

  } 
  reformattedDate = reformattedDate.slice(0,17) + String(hour) + reformattedDate.slice(19,22) + indicator
  var endDate = reformattedDate
var viewMapButton = document.createElement("button")
viewMapButton.innerHTML = "View Map"
viewMapButton.onclick = function(){
  viewOnMap(location, wordLocation)
}
var commentsButton = document.createElement("button")
commentsButton.innerHTML = "View Comments"
commentsButton.classList.add("myRealButtons")

commentsButton.onclick = function(){

  readComments(handle, name, data)
  commentsModal.style.display = "block";
  document.getElementById("comment").style.display = "block"
  document.getElementById("submitComment").style.display = "block"
}
var interestedButton = document.createElement("button")
var goingButton = document.createElement("button")
interestedButton.innerHTML = "Interested"
goingButton.innerHTML = "Going"
interestedButton.onclick = function(){
  interestedInProtest(handle, name, myUser)
  window.alert("Marked as Interested!")
}
goingButton.onclick = function(){
  goingToProtest(handle, name, myUser)
  window.alert("Marked as Going!")
}
var newText  = document.createTextNode(name);

titleDiv.appendChild(newText)
titleDiv.classList.add("centerPro")
var starting = document.createTextNode(startDate)

var ending = document.createTextNode(endDate)
var interestCount = document.createTextNode(interested)
var goingCount = document.createTextNode(going)
//getting the image data and post data
newCell.appendChild(titleDiv)

newCell.appendChild(profileImage);
newCell.appendChild(document.createTextNode(" "));
newCell.appendChild(document.createTextNode("@"))
newCell.appendChild(pfpText);
newCell.appendChild(document.createElement("hr"));

newCell.appendChild(document.createTextNode(" "));
newCell.appendChild(document.createTextNode("-->"));
newCell.appendChild(document.createTextNode("Starts: "));
newCell.appendChild(starting);
newCell.appendChild(document.createElement("br"));
newCell.appendChild(document.createTextNode("-->"));
newCell.appendChild(document.createTextNode("Ends: "));
newCell.appendChild(ending);
newCell.appendChild(document.createElement("br"));
newCell.appendChild(document.createTextNode("-->"));
newCell.appendChild(document.createTextNode("INTERESTED: "));
newCell.appendChild(interestCount);
newCell.appendChild(document.createElement("br"));
newCell.appendChild(document.createTextNode("-->"));
newCell.appendChild(document.createTextNode("GOING: "));
newCell.appendChild(goingCount);
newCell.appendChild(document.createElement("br"));
newCell.appendChild(document.createTextNode("-->"));
newCell.appendChild(document.createTextNode(wordLocation));
newCell.appendChild(document.createElement("br"));
newCell.appendChild(document.createElement("br"));
newCell.appendChild(viewMapButton);
newCell.appendChild(interestedButton);
newCell.appendChild(goingButton);
newCell.appendChild(commentsButton);
commentsButton.style.color = "black"
if (myUser == handle){
  var dashboardButton = document.createElement("button")
  dashboardButton.innerHTML = "View Dashboard"
  dashboardButton.classList.add("myRealButtons")
  dashboardButton.style.backgroundColor = "#124665"
  dashboardButton.style.width = "200px"
  dashboardButton.onclick = function() {
    console.log("here")
    showDashboard(handle, name, data )
    dashModal.style.display = "block";
  }
  newCell.appendChild(dashboardButton);
  }

newCell.appendChild(document.createElement("br"));
newCell.appendChild(document.createElement("br"));
newCell.appendChild(descripDiv);
viewMapButton.classList.add("myRealButtons")
interestedButton.classList.add("myRealButtons")
goingButton.classList.add("myRealButtons")

viewMapButton.classList.add("buttoncolor")
interestedButton.classList.add("buttoncolor")
goingButton.classList.add("buttoncolor")

//picCell.classList.add("card")

newCell.classList.add("protestcard")

profileImage.classList.add("profile-pic")
}

async function viewOnMap(location, word){
  var marker = new mapboxgl.Marker()
.setLngLat(location)
.addTo(map);


showMap()
geocoder.query(word)
}

async function showMap(){
  document.getElementById("coverMap").style.display = "block";
}
function hideMap(){
  document.getElementById("coverMap").style.display = "none";
}

// pfp
async function updatePfp(user){
  var storageRef = storage.ref();

 

  var pfpLink = await storageRef.child(user + "/" + user + "pfp" +"_400x400").getDownloadURL()
    er = "https://firebasestorage.googleapis.com/v0/b/protestapp-599ff.appspot.com/o/default%2Fpfp_400x400.png?alt=media&token=f69b4ca5-cffe-4d36-90ec-98319bf77d6b"


  data = {
    pfp: pfpLink || er
  }

  fbru = await db.collection("users").doc(user).update(data)
  userMap = await db.collection("posts").where("handle", "==", user).get()
  userArray = userMap.docs.map(doc => doc.data())
  console.log(userArray)
  for(q=1;q<userArray.length + 1;q++){
  db.collection('posts').doc(user + String(q)).update(data).catch(function(){
    console.log("no post exists")
  })
  }
   console.log("we did it")
  localStorage["cachedPfp"] = pfpLink
  setTimeout('', 10000)
  location.reload()
}

async function profilePicLoad(user){

 
  console.log('lol')
  

}

function hidePosts() {
  document.getElementById("myTable").style.display = "none";
  document.getElementById("protestsTable").style.display = "block";
}
function hideProtests() {
  document.getElementById("protestsTable").style.display = "none";
  document.getElementById("myTable").style.display = "block";
}

async function interestedInProtest(creator, name, user){
  var al = await firebase.firestore().collection('events').doc(creator + name).get()
const ss = await firebase.firestore().collection('events').doc(creator + name)

  if (al.data().interested.includes(user)){
    console.log("already exists")}
  else {
  ss.update({
    interested: firebase.firestore.FieldValue.arrayUnion("@" + user + ": " + localStorage["userEmail"])
  })
}
}

async function goingToProtest(creator, name, user){
  var a = await firebase.firestore().collection('events').doc(creator + name).get()
const dd = await firebase.firestore().collection('events').doc(creator + name)

  if (a.data().going.includes(user)){
    console.log("already exists")}
  else {
  dd.update({
    going: firebase.firestore.FieldValue.arrayUnion("@" + user + ": " + localStorage["userEmail"])
  })
}
}
//

async function viewMyProfile() {
  localStorage['userToView'] = myUser
  console.log(myUser)
  window.location.href = "profile.html";
}

function viewThisProfile(param) {
  localStorage['userToView'] = param
  window.location.href = "profile.html"
}
// Chat
function viewMyFeed() {
  window.location.href = "realfeed.html";
}
function viewMyProtests() {
  window.location.href = "protestfeed.html";
}
function viewSearch() {
  window.location.href = "index.html";
}

function backToLogin(){
  logout()
  window.location.href = "login_signup.html";
}

function chooseProduct(){
  isAProduct = !isAProduct
  console.log(isAProduct)
  if (isAProduct==true){
  document.getElementById("productChoice").style.backgroundColor = "#CDD0D4"
}
if (isAProduct==false){
  document.getElementById("productChoice").style.backgroundColor = "#EAEEED"
}

}
function toMarketplace(){
  window.location.href = "marketplace.html"
}

async function retrieveMarketplace() {
  var allProducts = []
  var timeofproduct = []
  const snapshops = await firebase.firestore().collection('posts').where("isProduct", "==", true).get()
  allProducts = snapshops.docs.map(doc => doc.data())
console.log(allProducts)





  //for (element in array){
    //allPosts.push(element)

  for(q=0;q<allProducts.length;q++){
    timeofproduct.push(allProducts[q].created)
  }
  
  var dictionaryArray = []
  for(q=0;q<allProducts.length;q++){
    dictionaryArray.push({
      key:allProducts[q],
      value: allProducts[q].created})
  }

  dictionaryArray.sort(function(a,b) {
    return b.value - a.value
});
console.log(dictionaryArray)

    for(q=0;q<dictionaryArray.length;q++){
      if (dictionaryArray[q].key.likes.includes(myUser)){
        btnColor = "#EAC2C2"
      }
      else {
        btnColor = "#EAEEED"
      }
    addToMarket(dictionaryArray[q].key.imageLink,dictionaryArray[q].key.text, dictionaryArray[q].key.handle, dictionaryArray[q].key.pfp, dictionaryArray[q].key.created, dictionaryArray[q].key.postNumber, dictionaryArray[q].key.likes.length, btnColor, dictionaryArray[q].key)
    }
    
  

}




 async function addToMarket(imgSource, caption, handle, pfp, timestamp, postNumber, newLikes, color, data){
  d = new Date()
  n = d.getTime()
  var tableRef = document.getElementById('myMarket').getElementsByTagName('tbody')[0];
  var reformattedDate = new Date((timestamp-25200)*1000).toUTCString()
  var indicator = " AM"
  var hour = parseInt((reformattedDate.slice(17,19)))
  if (parseInt(reformattedDate.slice(17,19)) >= 12){
    indicator = " PM"
    hour = hour - 12

  } 
  reformattedDate = reformattedDate.slice(0,17) + String(hour) + reformattedDate.slice(19,22) + indicator
  var timeInfo = document.createTextNode(reformattedDate)



// Insert a row in the table at the last row
var newRow   = tableRef.insertRow();
var pfpText = document.createTextNode(handle)
var profileImage = document.createElement("img")
var followButton = document.createElement("button")
var likeButton = document.createElement("button")
var listLikeButton = document.createElement("button")
var picandhandlediv = document.createElement("div")
var textDiv = document.createElement("div")
var spanDiv = document.createElement("span")
var commentsButton = document.createElement("button")
commentsButton.innerHTML = "View Comments"
commentsButton.classList.add("myRealButtons")
commentsButton.onclick = function(){

  readComments(handle, postNumber, data)
  commentsModal.style.display = "block";
  document.getElementById("comment").style.display = "block"
  document.getElementById("submitComment").style.display = "block"
}
spanDiv.classList.add("spanForText")

picandhandlediv.appendChild(profileImage)
picandhandlediv.appendChild(document.createTextNode("@"))
picandhandlediv.appendChild(pfpText)

picandhandlediv.onclick = function(){
  viewThisProfile(handle)
}
picandhandlediv.style.cursor = "pointer"

var datediv = document.createElement("div")
datediv.appendChild(timeInfo)
datediv.classList.add("datediv")
picandhandlediv.appendChild(datediv)
profileImage.src = pfp
followButton.innerHTML = "Follow Me"
followButton.onclick =  function _ (){
  followUser(handle)
}
likeButton.innerHTML = "Like"
likeButton.id = handle + String(postNumber)
likeButton.style.backgroundColor = color
likeButton.onclick = function __ (){
  likePost(handle, postNumber)
}
listLikeButton.innerHTML = newLikes + " &hearts;"
listLikeButton.style.backgroundColor = "#124665"
listLikeButton.style.color = "white"
listLikeButton.onclick = function ___ () {
  newLikeList(handle,postNumber, data)
  commentsModal.style.display = "block";
  document.getElementById("comment").style.display = "None"
  document.getElementById("submitComment").style.display = "None"
}
//followButton.onclick = followUser(handle)

// Insert a cell in the row at index 0
var newCell  = newRow.insertCell(0);
var picCell = newRow.insertCell(1);
// Append a text node to the cell


var newText  = document.createTextNode(caption);
var likesDiv = document.createElement("div")
likesDiv.style.display = "inline"
likesDiv.appendChild(likeButton)
likesDiv.appendChild(listLikeButton)
likesDiv.appendChild(commentsButton)
spanDiv.appendChild(newText)
textDiv.appendChild(spanDiv)
textDiv.classList.add("scrollPosts")
//getting the image data and post data
newCell.appendChild(picandhandlediv)
newCell.appendChild(document.createElement("hr"));
newCell.appendChild(textDiv);
newCell.appendChild(likesDiv);
if (myUser == handle){
var deletediv = document.createElement("div")
deletediv.style.color = "white"
deletediv.style.fontSize = "10px"
deletediv.style.marginLeft = "20px"
deletediv.style.marginTop = "20px"
deletediv.style.cursor = "pointer"
deletediv.innerHTML = "&#x26D4; Delete Post"
console.log("this far")
deletediv.onclick = function(){
  deletePost(handle, postNumber)
}
newCell.appendChild(deletediv)
}

likeButton.classList.add("myRealButtons")

listLikeButton.classList.add("myRealButtons")
likeButton.style.marginRight = "0px"
listLikeButton.style.marginRight = "0px"
commentsButton.style.marginRight = "0px"

var img = document.createElement("img")
img.src = imgSource
picCell.appendChild(img)
img.classList.add("image")
img.onclick = function(){
  window.open(imgSource, "_blank")
}
img.style.cursor = "pointer"
//picCell.classList.add("card")
picCell.classList.add("picture")
newCell.classList.add("card")
profileImage.classList.add("profile-pic")
}

function editUser(){
  if (myUser == userToView) {
    document.getElementById("profileSettings").style.display = "block"
  }
}

async function getUserData() {
  var storageRef = storage.ref();
  var cool = await storageRef.child("default" + "/" +  "pfp_400x400.png").getDownloadURL()
  userD = await db.collection("users").doc(userToView).get()
  
  document.getElementById("profileImage").src = userD.data().pfp || cool
  document.getElementById("bio").innerText = userD.data().bio
  document.getElementById("countFollowers").innerText = userD.data().followers.length + " followers"
  document.getElementById("countFollowing").innerText = userD.data().following.length + " following"
}

async function follow() {
  var followThisUser = await db.collection("users").doc(userToView).get()
  var followRef = await db.collection("users").doc(userToView)
  var followerList = followThisUser.data().followers
  if (followerList.includes(myUser)){
    console.log("you already follow them")
  }
  else{
    followRef.update({
      followers: firebase.firestore.FieldValue.arrayUnion(myUser)
    })
  }
  var myUserFollowing = await db.collection("users").doc(myUser).get()
  var myUserRef = await db.collection("users").doc(myUser)
  if (myUserFollowing.data().following.includes(userToView)){
    console.log("you already follow them")
  }
  else{
    myUserRef.update({
      following: firebase.firestore.FieldValue.arrayUnion(userToView)
    }) 

  }

}

async function unfollow() {

  var unfollowThisUser = await db.collection("users").doc(userToView).get()
  var unfollowRef = await db.collection("users").doc(userToView)
  var unfollowerList = unfollowThisUser.data().followers
  if (unfollowerList.includes(myUser)){
    unfollowRef.update({   
      followers: firebase.firestore.FieldValue.arrayRemove(myUser)
    })
   
  }
  else{
    console.log("you don't follow them")
  }
  var removeFromMyList = await db.collection("users").doc(myUser).get()
  var removeRef = await db.collection("users").doc(myUser)
  var removeList = removeFromMyList.data().following
  if (removeList.includes(userToView)){
    removeRef.update({   
      following: firebase.firestore.FieldValue.arrayRemove(userToView)
    })

   
  }
  else{
    console.log("they weren't in your list anyways")
  }
  
 
}
 async function buttons() {
   dat = await db.collection("users").doc(myUser).get()
   if (dat.data().following.includes(userToView)){
     document.getElementById("unfollow").style.display = "inline"
     document.getElementById("unfollow").style.marginBottom = "20px"
     document.getElementById("follow").style.display = "none"
     document.getElementById("unfollow").style.marginTop = "10px"
   }
   else{
    document.getElementById("unfollow").style.display = "none"
    document.getElementById("follow").style.display = "inline"
    document.getElementById("follow").style.marginBottom = "20px"
    document.getElementById("follow").style.marginTop = "10px"
   }

 }

 async function updateBio() {
  var bioref = await db.collection("users").doc(myUser)
  await bioref.update({
    bio: document.getElementById("bioInput").value
  })
  setTimeout('',1000)
  location.reload()
 }

 function toCreateProtest(){
  window.location.href = "createprotest.html";
 }
 function toCustomDesigner(){
  window.location.href = "postermaker.html";
 }
 function findProfile(){
  localStorage["userToView"] = myUser
  window.location.href = "profile.html";
}

var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("follow");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  follow()
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  setTimeout('',1000)
  location.reload()
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

var unfollowModal = document.getElementById("unfollowModal");

// Get the button that opens the modal
var unfollowbtn = document.getElementById("unfollow");

// Get the <span> element that closes the modal
var unfollowspan = document.getElementsByClassName("close")[1];

// When the user clicks on the button, open the modal
unfollowbtn.onclick = function() {
  unfollow()
  unfollowModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
unfollowspan.onclick = function() {
  unfollowModal.style.display = "none";
  setTimeout('',1000)
  location.reload()
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == unfollowModal) {
    unfollowModal.style.display = "none";
  }
}

var followersModal = document.getElementById("followersModal");

// Get the button that opens the modal
var followersBtn = document.getElementById("countFollowers");

// Get the <span> element that closes the modal
var followersSpan = document.getElementsByClassName("close")[2];

// When the user clicks on the button, open the modal
followersBtn.onclick = function() {
  showFollowers()
  followersModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
followersSpan.onclick = function() {
  followersModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == followersModal) {
    followersModal.style.display = "none";
  }
}

async function showFollowers(){
  var intended  = await db.collection("users").doc(userToView).get()
  var intendedarray = intended.data().followers
  for(q=0;q<intendedarray.length;q++){
  followersTable(intendedarray[q])
  }
}

async function followersTable(user) {
  var tableRef = document.getElementById('followersTable').getElementsByTagName('tbody')[0];
  var newRow   = tableRef.insertRow();
  var newCell  = newRow.insertCell(0);
  containerDiv = document.createElement("div")
  containerDiv.appendChild(document.createTextNode(user))
  newCell.appendChild(containerDiv)
  containerDiv.onclick = function (){
    viewThisProfile(user)
  }
  containerDiv.style.cursor = "pointer"

}
async function showFollowing(){
  var intendedd  = await db.collection("users").doc(userToView).get()
  var intendeddarray = intendedd.data().following
  for(q=0;q<intendeddarray.length;q++){
  followingTable(intendeddarray[q])
  }
}

async function followingTable(user) {
  var tableRef = document.getElementById('followingTable').getElementsByTagName('tbody')[0];
  var newRow   = tableRef.insertRow();
  var newCell  = newRow.insertCell(0);
  containerDiv = document.createElement("div")
  containerDiv.appendChild(document.createTextNode(user))
  newCell.appendChild(containerDiv)
  containerDiv.onclick = function (){
    viewThisProfile(user)
  }
  containerDiv.style.cursor = "pointer"

}
var followingModal = document.getElementById("followingModal");

// Get the button that opens the modal
var followingBtn = document.getElementById("countFollowing");

// Get the <span> element that closes the modal
var followingSpan = document.getElementsByClassName("close")[3];

// When the user clicks on the button, open the modal
followingBtn.onclick = function() {
  showFollowing()
  followingModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
followingSpan.onclick = function() {
  followingModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == followingModal) {
    followignModal.style.display = "none";
  }
}
function changeText(){
  document.getElementById("follow").innerHTML = "Unfollow"
}

async function preventHacking(){
  firebase.auth().onAuthStateChanged(async function(user) {
    if (user) {
      var email = await firebase.auth().currentUser.email
      localStorage['userEmail'] = email
      var document = await db.collection("users").doc(myUser).get()
      var emailCheck = document.data().email
      if (emailCheck != email){
        logout()
      }
      console.log("you are logged in")
      
    }
  });
  
  

}
console.log('what')
var commentsModal = document.getElementById("commentsModal");

// Get the button that opens the modal
var commentbtn = document.getElementById("tga");

// Get the <span> element that closes the modal
var commentspan = document.getElementsByClassName("close")[4];

// When the user clicks on the button, open the modal
commentbtn.onclick = function() {
  console.log("hellp")
  commentsModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
commentspan.onclick = function() {
  commentsModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == commentsModal) {
    commentsModal.style.display = "none";
  }
}
/*
var imgModal = document.getElementById("imageModal");

// Get the button that opens the modal
var imgBtn = document.getElementById("fuck");

// Get the <span> element that closes the modal
var imgSpan = document.getElementsByClassName("close")[5];

// When the user clicks on the button, open the modal
imgBtn.onclick = function() {
  clickOnImage(myUser,1)
  imgModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
imgSpan.onclick = function() {
  imgModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == imgModal) {
    imgModal.style.display = "none";
  }
}

async function clickOnImage(user, postNumber){

// When the user clicks anywhere outside of the modal, close it

  document.getElementById("modalimg" + user + String(postNumber)).style.display = "inline"
  console.log("done")
}
*/

async function readComments(user, postNumber, data) {

  localStorage['userComment'] = user + String(postNumber)
 
  if (data.comments != undefined){
    var doc = data.comments
    var count = 0
  for (x=0; x<doc.length; x++){
    addToCommentsTable(doc[x])
    count = count + 1
    console.log(count)
  }
localStorage['tableRowCount'] = count

console.log(document.getElementById("commentsTable").rows.length)
}

  else {
  console.log("failure")
    }
   
  }


async function addToCommentsTable(comment) {
  var tableRef = document.getElementById('commentsTable').getElementsByTagName('tbody')[0];
  var newRow   = tableRef.insertRow();
  var newCell  = newRow.insertCell(0);
  newCell.appendChild(document.createTextNode(comment))
  newCell.onclick = function(){(viewThisProfile(comment.split(':')[0].slice(1)))}
  newCell.style.cursor = "pointer"
  
  
}

async function makeAComment() {
  var text = document.getElementById("comment").value
  var ref = db.collection("posts").doc(localStorage["userComment"])
  ref.update({
    comments: firebase.firestore.FieldValue.arrayUnion("@" + myUser + ": " + text) 
  })
  document.getElementById("comment").value = ''

}

async function makeAProtestComment() {
  var text = document.getElementById("comment").value
  var ref = db.collection("events").doc(localStorage["userComment"])
  ref.update({
    comments: firebase.firestore.FieldValue.arrayUnion("@" + myUser + ": " + text) 
  })
  document.getElementById("comment").value = ''

}
function newLikeList(user,postNumber,data) {

  localStorage['userLikes'] = user + String(postNumber)
 
  if (data.likes != undefined){
    var doc = data.likes
    var count = 0
  for (x=0; x<doc.length; x++){
    addToLikesTable(doc[x])
    count = count + 1
    console.log(count)
  }
  localStorage['tableRowCount'] = count

}

  else {
  console.log("failure")
    }
}

async function addToLikesTable(user) {
  var tableRef = document.getElementById('commentsTable').getElementsByTagName('tbody')[0];
  var newRow   = tableRef.insertRow();
  var newCell  = newRow.insertCell(0);
  newCell.appendChild(document.createTextNode(user))
  newCell.onclick = function(){(viewThisProfile(user))}
  newCell.style.cursor = "pointer"
  
}

async function deletePost(user,postNumber){
  var r = confirm("Are you sure you want to delete your post? You won't be able to retrieve it ever again.")
  if (r){
  await db.collection("posts").doc(user + String(postNumber)).delete()
  location.reload()
  }
}
function showDashboard(user, title, data) {
  localStorage["dashCount"] = 0
  if (data.going != undefined){
    goingEmails = ["Going Emails: "]
    var doc = data.going
    var count2 = 1
  for (x=0; x<doc.length; x++){

    addToDashboard(doc[x],true)
    count2 = count2 + 1
    console.log(count)
    goingEmails = goingEmails + doc[x].split(":")[1].slice(1) + ', '
  }
  document.getElementById("goingEmails").innerHTML = goingEmails
  localStorage["isGoing"] = count2
}
if (data.interested != undefined){
interestedEmails = ["Interested Emails: "]
  var doc2 = data.interested
  var count = 1
  localStorage["isInt"] = 1
for (x=0; x<doc2.length; x++){
  addToDashboard(doc2[x], false)
  count = count + 1
  localStorage["isInt"] = count
  console.log(count)
  interestedEmails = interestedEmails + doc2[x].split(":")[1].slice(1) + ', '
}
  document.getElementById("intEmails").innerHTML = interestedEmails
localStorage['dashCount'] = Math.max(count, count2)
}

}

function addToDashboard(user, isGoing){
  if (isGoing){
  console.log(user)
  var tableRef = document.getElementById('dashTable').getElementsByTagName('tbody')[0];
  var newRow   = tableRef.insertRow();
  var newCell  = newRow.insertCell(0);

  newCell.appendChild(document.createTextNode(user))
  newCell.onclick = function(){(viewThisProfile(user))}
  newCell.style.cursor = "pointer"
 
  }
  else {
    if (localStorage["isInt"] < localStorage["isGoing"]){
     
      var rowref = document.getElementById('dashTable').rows[localStorage['isInt']]
      var secondCell = rowref.insertCell(-1)
      secondCell.appendChild(document.createTextNode(user))
      secondCell.onclick = function(){(viewThisProfile(user))}
      secondCell.style.cursor = "pointer"
    }
    else{
      var tableRef = document.getElementById('dashTable').getElementsByTagName('tbody')[0];
      var newRow   = tableRef.insertRow();
      var cell1  = newRow.insertCell(0);
      var newCell  = newRow.insertCell(1);
    
      newCell.appendChild(document.createTextNode(user))
      newCell.onclick = function(){(viewThisProfile(user))}
      newCell.style.cursor = "pointer"
    }

  }

  }

  
  function redirected(other){
    if (localStorage['redirect'] = true){
    other()
    }
  }