var db = firebase.firestore();
var storage = firebase.storage();

totalPosts = 0

var myUser = localStorage['myUser'] || 'N/A';
var userToView = localStorage['userToView'] || myUser;
var cachedPfp = localStorage["cachedPfp"] || "https://firebasestorage.googleapis.com/v0/b/protestapp-599ff.appspot.com/o/default%2Fpfp.png?alt=media&token=ac4e5c07-b577-4ad0-99f4-4fe3bc525d55"
var isAProduct = false

function checkIfLoggedIn(){
  if (localStorage['myUser'] == undefined) {
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
    bio: "I am new to Apptivist!",
    pfp: "https://firebasestorage.googleapis.com/v0/b/protestapp-599ff.appspot.com/o/default%2Fpfp.png?alt=media&token=ac4e5c07-b577-4ad0-99f4-4fe3bc525d55",
    followers: [document.getElementById("field6").value],
    following: [document.getElementById("field6").value]

  };
  

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
  localStorage["cachedPfp"] = "https://firebasestorage.googleapis.com/v0/b/protestapp-599ff.appspot.com/o/default%2Fpfp.png?alt=media&token=ac4e5c07-b577-4ad0-99f4-4fe3bc525d55"
  window.location.href = "welcome.html";
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
    pfp: pfpLink,
    isProduct: isAProduct,
    likes: [myUser]
  }
  //document.getElementById("makePost").style.display = "block";
  db.collection('posts').doc(myUser + String(num)).set(data);

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
      addToTable(dictionaryArray[q].key.imageLink,dictionaryArray[q].key.text, dictionaryArray[q].key.handle, dictionaryArray[q].key.pfp, dictionaryArray[q].key.created, dictionaryArray[q].key.postNumber, dictionaryArray[q].key.likes.length)
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
  
    addToTable(dictionaryArray[q].key.imageLink,dictionaryArray[q].key.text, dictionaryArray[q].key.handle, dictionaryArray[q].key.pfp, dictionaryArray[q].key.created, dictionaryArray[q].key.postNumber, dictionaryArray[q].key.likes.length)
    }
    
  }

}
}



 async function addToTable(imgSource, caption, handle, pfp, timestamp, postNumber, newLikes){
  d = new Date()
  n = d.getTime()
  var tableRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];
  var timeInfo = document.createTextNode(new Date(timestamp*1000).toUTCString())


// Insert a row in the table at the last row
var newRow   = tableRef.insertRow();
var pfpText = document.createTextNode(handle)
var profileImage = document.createElement("img")
var followButton = document.createElement("button")
var likeButton = document.createElement("button")
var countLikes = document.createTextNode(newLikes)
var listLikeButton = document.createElement("button")
var picandhandlediv = document.createElement("div")
var textDiv = document.createElement("div")
var spanDiv = document.createElement("span")
spanDiv.classList.add("spanForText")

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
likeButton.innerHTML = "Like"
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
var likesDiv = document.createElement("div")
likesDiv.appendChild(likeButton)
likesDiv.appendChild(countLikes)
likesDiv.appendChild(document.createTextNode(" Likes"))
likesDiv.appendChild(listLikeButton)
spanDiv.appendChild(newText)
textDiv.appendChild(spanDiv)
textDiv.classList.add("scrollPosts")
//getting the image data and post data
newCell.appendChild(picandhandlediv)
newCell.appendChild(document.createElement("hr"));
newCell.appendChild(textDiv);
newCell.appendChild(likesDiv);


likeButton.classList.add("myRealButtons")
listLikeButton.classList.add("myRealButtons")

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
var ate = await firebase.firestore().collection('posts').doc(user + postNumber).get()
const ref = await firebase.firestore().collection('posts').doc(user + postNumber)

  if (ate.data().likes.includes(myUser)){
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
  localStorage["cachedPfp"] = pfpLink
}

async function profilePicLoad(user){
  var storageRef = storage.ref();
  console.log(user + "/" + user + "pfp")
  //if (await storageRef.child(user + "/" + user + "pfp").getDownloadURL() == null){
    //var pfpLink = await storageRef.child("default/pfp.png").getDownloadURL()
  //}
  //else{
  //var pfpLink = await storageRef.child(user + "/" + user + "pfp").getDownloadURL()
//}
  //console.log(pfpLink)
  document.getElementById("profileImage").src = cachedPfp
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
    interested: firebase.firestore.FieldValue.arrayUnion(user)
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
    going: firebase.firestore.FieldValue.arrayUnion(user)
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
  
    addToMarket(dictionaryArray[q].key.imageLink,dictionaryArray[q].key.text, dictionaryArray[q].key.handle, dictionaryArray[q].key.pfp, dictionaryArray[q].key.created, dictionaryArray[q].key.postNumber, dictionaryArray[q].key.likes.length)
    }
    
  

}




 async function addToMarket(imgSource, caption, handle, pfp, timestamp, postNumber, newLikes){
  d = new Date()
  n = d.getTime()
  var tableRef = document.getElementById('myMarket').getElementsByTagName('tbody')[0];
  var timeInfo = document.createTextNode(new Date(timestamp*1000).toUTCString())


// Insert a row in the table at the last row
var newRow   = tableRef.insertRow();
var pfpText = document.createTextNode(handle)
var profileImage = document.createElement("img")
var followButton = document.createElement("button")
var likeButton = document.createElement("button")
var countLikes = document.createTextNode(newLikes)
var listLikeButton = document.createElement("button")
var picandhandlediv = document.createElement("div")
var textDiv = document.createElement("div")
var spanDiv = document.createElement("span")
spanDiv.classList.add("spanForText")

picandhandlediv.appendChild(profileImage)
picandhandlediv.appendChild(document.createTextNode("@"))
picandhandlediv.appendChild(pfpText)

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
var likesDiv = document.createElement("div")
likesDiv.appendChild(likeButton)
likesDiv.appendChild(countLikes)
likesDiv.appendChild(document.createTextNode(" Likes"))
likesDiv.appendChild(listLikeButton)
spanDiv.appendChild(newText)
textDiv.appendChild(spanDiv)
textDiv.classList.add("scrollPosts")
//getting the image data and post data
newCell.appendChild(picandhandlediv)
newCell.appendChild(document.createElement("hr"));
newCell.appendChild(textDiv);
newCell.appendChild(likesDiv);


likeButton.classList.add("myRealButtons")
listLikeButton.classList.add("myRealButtons")

var img = document.createElement("img")
img.src = imgSource
picCell.appendChild(img)
img.classList.add("image")

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
  userD = await db.collection("users").doc(userToView).get()
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
  bioref.update({
    bio: document.getElementById("bioInput").value
  })
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