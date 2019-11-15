$(function() {
    $('.submit-button').click(function() {
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
        width: '400px',
        data: stock_data,
        //data: sampleArray,
        maximumSelectionLength: 5,
        //matcher: function() {
            //console.log(params);
            //console.log(data);
            //console.log(item);
            //return data.toString().toLowerCase().indexOf(params.toString().toLowerCase()) >= 0
            //|| option.id.toUpperCase().indexOf(term.toUpperCase())>=0;
        //}

    });
});