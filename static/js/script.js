$(function() {
    //$('.submit-button').click(function() {
    $('#stock_form').submit(function(event) {
        event.preventDefault();
        if ($('#stock_form')[0].checkValidity() === false) {
            event.stopPropagation();
        }
        else {
            //do your ajax submition here
        
        
        $.ajax({
            url: '/optimize',
            data: $('form').serialize(),
            type: 'POST',
            success: function(response) {
                //console.log(response['data']);
                drawChart(response['data']);
            },
            error: function(error) {
                console.log(error['responseJSON']['message']);
            }
        });
        }
        $('#stock_form').addClass('was-validated');
    });
});

//$(function() {
//    $('input[type=checkbox]').change(function(){
//        if(this.checked){
//            console.log("I am here")
//            $.ajax({
//                url: '/checked',
//                data: $('input[type=checkbox]').val(),
//                type: 'POST',
//                dataType: 'json',
//                success: function(response){
//                    chart_data = jQuery.parseJSON(response)
//                    console.log(chart_data)
//                    drawChart(chart_data)
                    //$('.color_div').css('background-color', response)
//                },
//                error: function(error){
//                    console.log(error);
//                }
//            }
//            )
//        }
//    })



//})

$(document).ready(function() {
    var sampleArray = [{id:'AAPL',text:'Apple'}, {id:'MSFT',text:'Microsoft'}
    ,{id:'GE',text:'General Electric'},{id:'NFLX',text:'Netflix'}
    ,{id:'AMZN',text:'Amazon'}, {id:'GOOGL',text:'Alphabet'}, {id:'PEP', text:'PepsiCo'}]

    console.log("document is ready")
    stock_data = jQuery.parseJSON(stock_data)
    console.log(stock_data)
    $('.search-bar').select2({
        placeholder: 'Select an option',
        //width: '400px',
        width: '100%',
        data: stock_data,
        //data: sampleArray,
        maximumSelectionLength: 15,
        theme: "bootstrap"
        //matcher: function() {
            //console.log(params);
            //console.log(data);
            //console.log(item);
            //return data.toString().toLowerCase().indexOf(params.toString().toLowerCase()) >= 0
            //|| option.id.toUpperCase().indexOf(term.toUpperCase())>=0;
        //}

    });




});

(function() {
    'use strict';
    window.addEventListener('load', function() {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('button', function(event) {
            console.log("IM INSIDE LISTENER")
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        }, false);
      });
    }, false);
  })();