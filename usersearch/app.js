var db = firebase.firestore();
var storage = firebase.storage();

totalPosts = 0

var myUser = localStorage['myUser'] || 'N/A';
var userToView = localStorage['userToView'] || myUser;

function checkIfLoggedIn(){
  if (myUser == "N/A") {
    window.location.href = "http://localhost:8000/login_signup.html";
  }
}
function signup(){
  var signupemail = document.getElementById("field1").value;
  var signuppass = document.getElementById("field5").value;
  firebase.auth().createUserWithEmailAndPassword(signupemail, signuppass).catch(function(error) {
  // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      window.alert("Error : " + errorMessage);
  // ...
  document.getElementById("user_para").innerHTML = "Welcome User : " + signupemail;
  });
  }

function test() {
  var signupemail = document.getElementById("field1").value;
  var signuppass = document.getElementById("field5").value;

  let data = {
    
    email: signupemail,
    firstName: document.getElementById("field2").value,
    isOrganization: false,
    lastName: document.getElementById("field4").value,
    userName: document.getElementById("field6").value,
    bio: "I am new to Apptivist!",
    pfp: "https://firebasestorage.googleapis.com/v0/b/protestapp-599ff.appspot.com/o/default%2Fpfp.png?alt=media&token=ac4e5c07-b577-4ad0-99f4-4fe3bc525d55"

  };
  

  // Add a new document in collection "cities" with ID 'LA'
  db.collection('users').doc(document.getElementById("field6").value).set(data);
  

  firebase.auth().createUserWithEmailAndPassword(signupemail, signuppass).catch(function(error) {
    // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert("Error : " + errorMessage);
    // ...
    document.getElementById("user_para").innerHTML = "Welcome User : " + signupemail;
  });
  
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

  var pfpLink = await storageRef.child(myUser + "/" + myUser + "pfp").getDownloadURL()
  let data = {
    imageLink: link,
    postNumber: num,
    text: tex,
    handle: myUser,
    created: n/1000,
    pfp: pfpLink
  }
  //document.getElementById("makePost").style.display = "block";
  db.collection('posts').doc(myUser + String(num)).set(data);
  firebase.firestore().collection('posts').doc(myUser + String(num)).collection("likes").doc("likers").set({
    likers: [myUser]
  })
}

async function submitPost() {
  var storageRef = storage.ref();

  console.log("In submit post, total posts is " + totalPosts)
  await storageRef.child(myUser + '/' + myUser + String(totalPosts + 1)).getDownloadURL().then(function(url) {
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
  });
  
  function login(){
  
    var userEmail = document.getElementById("email_field").value;
    var userPass = document.getElementById("password_field").value;
  
    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
  
      window.alert("Error : " + errorMessage);
  
      // ...

    });
  
  }
  
  function logout(){
    firebase.auth().signOut();
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
      addToTable(dictionaryArray[q].key.imageLink,dictionaryArray[q].key.text, dictionaryArray[q].key.handle, dictionaryArray[q].key.pfp, dictionaryArray[q].key.created, dictionaryArray[q].key.postNumber)
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

db.collection("users").doc(myUser)
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
  const snapFollow = await firebase.firestore().collection('users').doc(myUser).collection("following").doc("following").get()
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
  
    addToTable(dictionaryArray[q].key.imageLink,dictionaryArray[q].key.text, dictionaryArray[q].key.handle, dictionaryArray[q].key.pfp, dictionaryArray[q].key.created, dictionaryArray[q].key.postNumber)
    }
    
  }

}
}



 async function addToTable(imgSource, caption, handle, pfp, timestamp, postNumber){
  d = new Date()
  n = d.getTime()
  var tableRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];
  var timeInfo = document.createTextNode(new Date(timestamp).toUTCString())
var csk = await likeNumber(handle, postNumber)
console.log(csk)
// Insert a row in the table at the last row
var newRow   = tableRef.insertRow();
var pfpText = document.createTextNode(handle)
var profileImage = document.createElement("img")
var followButton = document.createElement("button")
var likeButton = document.createElement("button")
var countLikes = document.createTextNode(csk)
var listLikeButton = document.createElement("button")
profileImage.src = pfp
followButton.innerHTML = "Follow Me"
followButton.onclick =  function _ (){
  followUser(handle)
}
likeButton.innerHTML = "Like this post"
likeButton.onclick = function __ (){
  likePost(handle, postNumber)
}
listLikeButton.innerHTML = "View Likers"
listLikeButton.onclick = function ___ () {
  likeList(handle,postNumber)
}
//followButton.onclick = followUser(handle)

// Insert a cell in the row at index 0
var newCell  = newRow.insertCell(0);
var picCell = newRow.insertCell(1);
// Append a text node to the cell
var newText  = document.createTextNode(caption);
//getting the image data and post data
newCell.appendChild(profileImage);
newCell.appendChild(document.createTextNode("@"))
newCell.appendChild(pfpText);
newCell.appendChild(document.createTextNode(" "));
newCell.appendChild(document.createTextNode("("));
newCell.appendChild(timeInfo);
newCell.appendChild(document.createTextNode(")"));
newCell.appendChild(document.createTextNode(" -- "));
newCell.appendChild(newText);
newCell.appendChild(followButton);
newCell.appendChild(likeButton);
newCell.appendChild(countLikes);
newCell.appendChild(listLikeButton);



var img = document.createElement("img")
img.src = imgSource
picCell.appendChild(img)
img.classList.add("image")

//picCell.classList.add("card")
picCell.classList.add("picture")
newCell.classList.add("card")
profileImage.classList.add("profile-pic")
}
//following System

function consolelogger() {
  console.log("this worked")
}

async function likePost(user, postNumber){
var ate = await firebase.firestore().collection('posts').doc(user + postNumber).collection("likes").doc("likers").get()
const ref = await firebase.firestore().collection('posts').doc(user + postNumber).collection("likes").doc("likers")

  if (ate.data().likers.includes(myUser)){
    console.log("already exists")}
  else {
  ref.update({
    likers: firebase.firestore.FieldValue.arrayUnion(myUser)
  })
}

}

async function likeNumber(user, postNumber){
  var ate = await firebase.firestore().collection('posts').doc(user + postNumber).collection("likes").doc("likers").get()
  return ate.data().likers.length
}

async function likeList(user, postNumber){
likers = []
  var likes = await firebase.firestore().collection('posts').doc(user + postNumber).collection("likes").get()
  const likesArray = likes.docs.map(doc => doc.data())
  console.log(likesArray)
  for(q=0;q<likesArray.length;q++){
    likers.push(likesArray[q].userName)
  }
  alert("these are the users who liked this post: " + likers)
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
    tags: ["no tags right now!"]

  }
  db.collection("events").doc(user + document.getElementById("protestName").value).set(data)
  db.collection("events").doc(user + document.getElementById("protestName").value).collection("interested").doc("interested").set({
    interested: [user],

  })
  db.collection("events").doc(user + document.getElementById("protestName").value).collection("going").doc("going").set({
    going: [user],

  })
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
  var interestedMap = await db.collection("events").doc(dictionaryArray[q].key.handle + dictionaryArray[q].key.name).collection('interested').doc('interested').get()
  var interested = interestedMap.data().interested.length
  var goingMap = await db.collection("events").doc(dictionaryArray[q].key.handle + dictionaryArray[q].key.name).collection('going').doc('going').get()
  var going = goingMap.data().going.length
  var userData = await db.collection("users").doc(dictionaryArray[q].key.handle).get()
  var linktopfp = userData.data().pfp
//If clauses to see if everything exists
 addToProtests(dictionaryArray[q].key.name,dictionaryArray[q].key.description, dictionaryArray[q].key.handle, linktopfp, dictionaryArray[q].key.startDate, dictionaryArray[q].key.endDate,interested, going, dictionaryArray[q].key.location)

  }
}

async function addToProtests(name, description, handle, pfp, startDate, endDate, interested, going, location){
  var tableRef = document.getElementById('protestsTable').getElementsByTagName('tbody')[0];
// Insert a row in the table at the last row
var newRow   = tableRef.insertRow();
var pfpText = document.createTextNode(handle)
var profileImage = document.createElement("img")
var wordLocation = null

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
startDate = new Date(startDate*1000).toUTCString()
endDate = new Date(endDate*1000).toUTCString()
endDate = endDate.slice(0,22)
startDate = startDate.slice(0,22)
var viewMapButton = document.createElement("button")
viewMapButton.innerHTML = "View Map"
viewMapButton.onclick = function(){
  viewOnMap(location, wordLocation)
}
var interestedButton = document.createElement("button")
var goingButton = document.createElement("button")
interestedButton.innerHTML = "Interested"
goingButton.innerHTML = "Going"
interestedButton.onclick = function(){
  interestedInProtest(handle, name, myUser)
}
goingButton.onclick = function(){
  goingToProtest(handle, name, myUser)
}
var newText  = document.createTextNode(name);

var starting = document.createTextNode(startDate)

var ending = document.createTextNode(endDate)
var interestCount = document.createTextNode(interested)
var goingCount = document.createTextNode(going)
//getting the image data and post data
newCell.appendChild(newText)
newCell.appendChild(document.createElement("br"));
newCell.appendChild(profileImage);
newCell.appendChild(document.createTextNode(" "));
newCell.appendChild(document.createTextNode("@"))
newCell.appendChild(pfpText);
newCell.appendChild(document.createElement("br"));
newCell.appendChild(document.createTextNode(" "));
newCell.appendChild(document.createTextNode(" -- "));
newCell.appendChild(document.createElement("br"));
newCell.appendChild(starting);
newCell.appendChild(document.createElement("br"));
newCell.appendChild(ending);
newCell.appendChild(document.createElement("br"));
newCell.appendChild(document.createTextNode("INTERESTED: "));
newCell.appendChild(interestCount);
newCell.appendChild(document.createElement("br"));
newCell.appendChild(document.createTextNode("GOING: "));
newCell.appendChild(goingCount);
newCell.appendChild(document.createElement("br"));
newCell.appendChild(document.createTextNode(wordLocation));
newCell.appendChild(document.createElement("br"));
newCell.appendChild(viewMapButton);
newCell.appendChild(interestedButton);
newCell.appendChild(goingButton);
newCell.appendChild(document.createElement("br"));
newCell.appendChild(descripDiv);
viewMapButton.classList.add("buttoncolor")





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

 

  var pfpLink = await storageRef.child(user + "/" + user + "pfp").getDownloadURL()
  data = {
    pfp: pfpLink
  }

  fbru = await db.collection("users").doc(user).update(data)
  userMap = await db.collection("posts").where("handle", "==", user).get()
  userArray = userMap.docs.map(doc => doc.data())
  console.log(userArray)
  for(q=1;q<userArray.length;q++){
  db.collection('posts').doc(user + String(q)).update(data)
  }

}

async function profilePicLoad(user){
  var storageRef = storage.ref();
  console.log(user + "/" + user + "pfp")
  if (await storageRef.child(user + "/" + user + "pfp").getDownloadURL() == null){
    var pfpLink = await storageRef.child("default/pfp.png").getDownloadURL()
  }
  else{
  var pfpLink = await storageRef.child(user + "/" + user + "pfp").getDownloadURL()
}
  console.log(pfpLink)
  document.getElementById("profileImage").src = pfpLink
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
  var al = await firebase.firestore().collection('events').doc(creator + name).collection("interested").doc("interested").get()
const ss = await firebase.firestore().collection('events').doc(creator + name).collection("interested").doc("interested")

  if (al.data().interested.includes(user)){
    console.log("already exists")}
  else {
  ss.update({
    interested: firebase.firestore.FieldValue.arrayUnion(user)
  })
}
}

async function goingToProtest(creator, name, user){
  var a = await firebase.firestore().collection('events').doc(creator + name).collection("going").doc("going").get()
const dd = await firebase.firestore().collection('events').doc(creator + name).collection("going").doc("going")

  if (a.data().going.includes(user)){
    console.log("already exists")}
  else {
  dd.update({
    going: firebase.firestore.FieldValue.arrayUnion(user)
  })
}
}
//

function viewMyProfile() {
  userToView = myUser
  window.location.href = "http://localhost:8000/profile.html";
}