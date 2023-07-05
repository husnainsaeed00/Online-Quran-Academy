$(document).ready(function() {
    $('.submit').click(function(event){
    event.preventDefault()
    console.log('clicked button')

    var email = $('.email').val()
    var subject = $('.subject').val()
    var message = $('.message').val()
    var statusElm = $('status')
    statusElm.empty()

    if(email.length>7 && email.includes('@') && email.includes('.')){
        statusElm.append('<div>Email is valid</div>')
    }else{
        statusElm.append('<div>Email is not valid</div>')
    }
    if(subject.length>3){
        statusElm.append('<div>Subject is valid</div>')
    }else{
        statusElm.append('<div>Subject is not valid</div>')
    }
    if(message.length>30){
        statusElm.append('<div>Message is valid</div>')
    }else{
        statusElm.append('<div>Message is not valid</div>')
    }

    })
})
