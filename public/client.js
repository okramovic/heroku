
var usr={};

$(function() {
  
  $.get("/getAll",processGetData)
  
  $("#header").click(function(){  $.get("/")})
  $("#showBrowse").click(function(){
    
    $("#browseDiv").show();
    $("#formDiv").hide();
    $("#helpDiv").hide();
    
    $.get("/getAll",function(){
          processGetData()
          hideAds()
    })
        /*$.post("/oneInquiry", "test", function(data, status){
          
              var newdata = data
              console.log(data);
              newdata.forEach(function(msg){
                console.log(msg)
                $('<p style="margin-top: 30px;">----------------</p>').appendTo($("#browseDiv"));
                $('<p>' + msg.msgText + '</p>').appendTo($("#browseDiv"))
              })
              
        })*/
  })
  $("#showForm").click(function(){
    
        $("#browseDiv").hide();
        $("#formDiv").css({"display": "block"});
        $("#helpDiv").hide();
    
        if (usr===undefined || usr.username === undefined) {
                  $("#formSubmit").prop("disabled", true)
        } else {
          
              $("#from").val(usr.email)
              $("#formSubmit").prop("disabled", false)
        }
  })  
  $("#showHelp").click(function(){
    
        //$("#helpDiv").css("display", "block")
        //$("#browseDiv").hide();
        //$("#formDiv").hide();
    
        //$.get("/help")
        document.location = 'https://feeki.glitch.me/help' 
  });
  /*$("#register").click(function(){
    
            //$.get("/register", function(data, status){
              
            //  console.log("register got")
            //})
            //$("#browseDiv").hide();
            //$("#formDiv").hide();
            //$("#helpDiv").hide();
    
    
  })*/
  $("#login").click(function(){
    
            $("#navigation").hide();
    
            $("#browseDiv").hide();
            $("#formDiv").hide();
            $("#helpDiv").hide();
    
    
            $("#loginDiv").css("display", "flex");
  })
  $("#loginSubmit").click(function(){
    
          $.post("/login", JSON.stringify({username: $("#username").val().toString(), 
                            pass: $("#pass").val().toString()}), function(data, status){
            
                  //console.log(data,"status", status)
            
                  if (status==="success" && data instanceof Object){
                                    
                                    console.log(data.username, data.email)//,"status", status)  
                                    usr.username = data.username
                                    usr.email = data.email
                    
                                    $("#loginDiv").hide();
                                        $("#username").val("")
                                        $("#pass").val("")
                                    $("#login, #register").hide()
                    
                                    $("#navigation").show();
                                    $("#browseDiv").show();
                    
                                    //$("#usr").html(usr.username)
                    
                                    //k cemu co
                                    $("#logRegDiv").append('<div id="logout" style="margin: 10px;">logout ' + usr.username + '</div>')
                  }
            
          })
  })
  $("#searchForm").submit(function(ev){
          ev.preventDefault()
          var toSearch = encodeURI( $("#searchFormText").val().toString() )
          
          console.log(toSearch)
          
          //document.location = 'https://feeki.glitch.me/search?text='+toSearch
    
          var route = "/search?text="+toSearch
          $.get(route, function(s1,s2){
            
              console.log(s1, s2)
              processGetData(s1)
          })
  })
  // for working with inquiry form
  $('#formSubmit').click(function(event) {
          console.log("form submitted)")
          event.preventDefault();

          // need: from, to[], serviceInbox[], cc[], bcc[], subject, keywords[], messageBody
          var query = {
              from:         $("#from").val().toString(), 
              to:           [$("#to").val().toString()],
              serviceInbox: ['testnulanulanic@seznam.cz'],
              cc:           [$("#cc").val().toString()],
              bcc:          [null], 
              subject:      $("#subject").val().toString(),
              keywords:     [$("#keywords").val()],
              messageBody:  $("#body").val()
          }

          $.post('/formSubmit', JSON.stringify(query), function(data, status) {
                console.log("server response:",data, status);

                if (data==="ok") {$.get("/getAll",processGetData)}
          });
  });

  $("#onNewInquiry").click(function(){}) 
  $("#onReplying").click(function(){}) 

  //$("*").hover(function(){
    //console.log(this)})
  
  
  
});

function processGetData(data){
            //console.log("fun: processGetData")
            //console.log(s2,s3);
            //console.log("array?",data instanceof Array)
            console.log(data)
            
            $("#formDiv").hide();
            $("#browseDiv").show();
  
            $("#resultsDiv").empty();
  
            data.forEach(function(email, index){
                  
                  var div = '<div id="thread' + index + '" class="emailDisplayed" data-title="' + email._id + 
                              '" onmouseover="highlight(this)" onmouseout="unlight(this)">'+  // 
                                
                                '<div class="msgHeader" >' +
                                    '<div style="display: flex; justify-content: space-between">' +
                                          '<div>from: ' + '<p class="adr">'+ email.thread.from.toString() + '</p></div>' +
                                          '<div>' + email.thread.date.substring(4, email.thread.date.indexOf("GMT")+3) + '</div>' +
                                    '</div>' +
                                    '<div>to: ' + '<p class="adr">' + email.thread.to.toString() + '</p></div>'
                  
                  if (email.thread.cc) div+='<div style="">cc: ' + '<p class="adr">'+ email.thread.cc + /*', bcc:' + email.thread.bcc +*/ '</p></div>'
              
                  div +=      //'<div style="font-size: 9px;">inquiry thread id: ' + email._id + '</div>' +
                              '<div>Subject: </div>' + 
                              '<div style="font-size: 30px; font-weight: 700;">' + email.thread.subject + '</div>' +
                              //'<div>keywords: ' + email.thread.keywords + '</div>'+
                          '</div>'
                          
                  
                  
                    if      (email.thread.textHTML)  div+= '<div class="emailDisplayedBody">' + email.thread.textHTML  + '</div>' + '</div>'
                    else if (!email.thread.textHTML) div+= '<div class="emailDisplayedBody">' + email.thread.textPlain.toString().replace(/\n/g,"<br>") + 
                            '</div>' + '</div>'
                      
                  $(div).appendTo($("#resultsDiv"))
              
                  hideAds()
                  
              
                  $('#thread' + index).click(function(){
                      //console.log(this)
                      //console.log(this.title)
                      var newID= 'id=' + $(this).attr("data-title")
                    
                      var newURL = 'https://feeki.glitch.me/thread?' + newID.toString()
                      
                            // watch?v=
                            //thread?Id=...
                      $.get('/thread?' + newID)//, function(data, status) {
                      document.location = newURL
                      /*$.get('/threadID?id=' + newID, function(data, status) {
                      //$.get('/threadId=?' + $.param({threadID: this.title}), "", function(data, status) {
                            
                            // https://www.w3schools.com/js/js_window_location.asp
                        
                            // this reloads the page
                            //document.location = newURL
                            
                            //window.location.href = data.redirect;
                        
                            // doesnt reload the page - good for getting link to specific part of page
                            //location.href += '#threadID=' + newID + '';
                        
                            //load and display data in div1   https://www.w3schools.com/jquery/jquery_ajax_load.asp
                            //$("#div1").load("demo_test.txt", function(responseTxt, statusTxt, xhr){...})
                        
                            //console.log(data, status)
                      })*/
                  })
                  /*$('#thread' + index).hover(function(){
                    
                        console.log(this)
                        var hdr = $(this).children("div.msgHeader")
                        $(hdr).css("background-color", "rgba(230,230,230,0.5)")
                  })*/
                  
            })
  
        $("#formDiv").hide();
        $("#browseDiv").show();
}

function highlight(el){
  
      //var hdr = 
      $(el).children("div.msgHeader").css("background-color", "rgba(230,230,230,0.5)")
     
      $(el).css("border","1px solid black");
      //$(el).css("border-top","1px solid black");
      
  
      $(el).next().css("border", "1px solid white") 
                        //"border-top":"1px solid white"})
      //console.log(   hdr ) 
      
}
function unlight(el){
  
      //var hdr = 
      $(el).children("div.msgHeader").css("background-color", "rgba(230,230,230,1)")
      
      $(el).css("border","1px solid white");
      $(el).css("border-top","1px solid black");
      //$(el).next().css("border", "1px solid white")//, "border-top":"1px solid black;"})
      $(el).next().css("border-top","1px solid black");
      //$(hdr).css("background-color", "rgba(230,230,230,1)")
  
}
function hideAds(){
  
      //console.log("hiding ads")
  
      $(".adr").toArray().forEach(function(el,i){
        
            var ad = $(el).text(), at = ad.substring(ad.indexOf("@"))
            
            //console.log(ad)
            
            ad= ad.substring(0,ad.indexOf("@"))
            
        
            if (ad.length === 1) $(el).text("*" + at)
            else if (ad.length === 2) $(el).text("*"+ad.charAt(1) + at)
            else if (ad.length > 2) $(el).text("**" + ad.substring(2) + at)
      })
}
