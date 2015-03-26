// A module to use for logging and updating the user
var logger = (function() {

    // Called before each
    var start = function(message, type) {
        console.log(type + ": " + message)
        $('#success').text('')
        $('#error').text('')
        $('#info').text('')
    }

    // Factory for logger methods
    var factory = function(type) {
        return function(message) {
            start(message, type)
            $('#'+type).text(message)
        }
    }

    return {
        error: factory('error'),
        success: factory('success'),
        info: factory('info')
    }
})()

// When we submit the form
$('#form').submit(function(event) {
    event.preventDefault()

    var phone = $('#phone').val()
    var name = $('#name').val()

    // Take out everything but numbers, and trim whitespace
    phone = (phone?phone.replace(/\D/g, '').trim():'')

    // Validation
    if(!name)
        logger.error("Please enter your name")
    else if(!phone)
        logger.error("Please enter your phone number")
    else if(phone.length < 10 && phone.length !== 7)
        logger.error("Invalid phone number")
    else {
        // Looks good
        logger.info('Sending message...')

        $.ajax({
            url:"http://twiliodemo-44626.onmodulus.net/send", // Replace with your server url
            jsonp:"callback", // JSONP to get around CORS issues
            dataType:"jsonp",
            data: {phone:phone, name:name},
            success: function(response) {
                // Called when our server handled everything okay, possibly with errors

                if(!response) // Just in case
                    logger.error("There was no response from the server")

                else if(response.status == 400) // Issue with client input
                    logger.error(response.error)

                else { // Looks like it worked
                    console.log(response)
                    logger.success('Your message has been sent successfully!')
                }
            },
            error: function(jqxhr, status) {

                // Something happened when our server was serving
                logger.error('There was an error when communicating with the server :(')
            }
        })
    }

})
