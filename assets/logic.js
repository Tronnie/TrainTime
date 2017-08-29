// Check that html and js are connected
console.log("docs are talking");

// Initialize Firebase
    var config = {
    apiKey: "AIzaSyAYyHUro2BOBlYkik-15i-UgXXbYNrNLnw",
    authDomain: "trains-49354.firebaseapp.com",
    databaseURL: "https://trains-49354.firebaseio.com",
    projectId: "trains-49354",
    storageBucket: "trains-49354.appspot.com",
    messagingSenderId: "321988477926"
    };
    firebase.initializeApp(config);

// Create a variable to reference the database.
   var database = firebase.database();
   var trainName = "";
   var destination = "";
   var firstTrain = "";
   var frequency = "";
   var format = "HH:mm";

// Capture Button Click
  $("#add-user").on("click", function(event) {
      event.preventDefault();

      trainName = $("#name-input").val().trim();
      destination = $("#destination-input").val().trim();
      firstTrain = $("#startTime-input").val().trim();
      frequency = $("#frequency-input").val().trim();

      // Push input data to database
      database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });

      //Clear the value fields after the push
      $("#add-user").val('');

    }); //<--end Button Click

//Add each new input instead of replacing existing ones
    database.ref().on("child_added", function(childSnapshot) {
        var childSnapshot = childSnapshot.val();
        console.log(childSnapshot.trainName);
        console.log(childSnapshot.destination);
        console.log("beginning at: " + childSnapshot.firstTrain);
        console.log(childSnapshot.frequency);

        //Variables to be calculated
        var tFrequency = (childSnapshot.frequency);
        console.log ("the frequency is: " + tFrequency + "mins");

        var firstTime = (childSnapshot.firstTrain);
        console.log ("starts running: " + firstTime);

          //Use moment.js for time calculations and format
          var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
          console.log("!!is first conversion " +firstTimeConverted);

          var currentTime = moment().format("HH:mm");
          console.log("the time now: " + currentTime);

          var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
          console.log("DIFFERENCE IN TIME: " + diffTime);

          // Time apart (remainder)
          var tRemainder = diffTime % tFrequency;
          console.log(tRemainder);

          // Minute Until Train
          var tMinutesTillTrain = tFrequency - tRemainder;
          console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

          // Next Train
          var nextTrain = moment().add(tMinutesTillTrain, "minutes");
          console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

        $("#body").append(
          "<tr><td>" + childSnapshot.trainName +
          "</td><td>" + childSnapshot.destination +
          "</td><td> " + childSnapshot.firstTrain +
          "</td><td>" + childSnapshot.frequency + "  mins" +
          "</td><td>"+ (moment(nextTrain).format("HH:mm")) +
          "</td><td>"+ (tMinutesTillTrain) + "  mins" +
          "</td></tr>"
      );

    }) //<--end child-added.
