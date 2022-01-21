// on ready
$(document).ready(function(){

    // show belgium popover
    if($('#homepagemap').length) {
        
        setTimeout(function(){
            $('#belgiumPop').tooltip("show");
            $('#romaniaPop').tooltip("show");
            $('#belgiumPop').addClass('highlight');
            $('#romaniaPop').addClass('highlight');
            setTimeout(function(){
                $('#belgiumPop').tooltip("hide");
                $('#romaniaPop').tooltip("hide");
                $('#belgiumPop').removeClass('highlight');
                $('#romaniaPop').removeClass('highlight');
            },5000);
        }, 1500);

        /* 
        var first = true;
        $('#homepagemap path').hover(function(){
            if(first) {
                setTimeout(function(){
                    $('#belgiumPop').tooltip("hide");
                    $('#romaniaPop').tooltip("hide");
                    $('#belgiumPop').removeClass('highlight');
                    $('#romaniaPop').removeClass('highlight');
                },200);
                first = false;
            }
        });*/
    
    }
        

    /* enabke popover
    if($('.homepagemap').length) {
        var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
            var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
            var poppies =  new bootstrap.Popover(popoverTriggerEl,{
                animation: true
            })

            $('#homepagemap').focus(function(){
                poppies.hide();
            }).blur(function(){
                poppies.show();
            });


            setTimeout(
            function() 
            {
                poppies.show();
            }, 1000);
            
        });

    }
    */
    

    /*-------
    Line Chart, Custom Code
    Dependency:
        - jquery-3.6.0.min.js
    Usage:
        - index.html
            - Statistics by Countries
        - statisticscountry.html
            - Statistics by region in United Kingdom
    */

    // check element exist        
    if($('.line-stats').length)  {

        // loop through the plot object, get data size and set as width for .plotter class.
        $('.line-stats ul li .plot').each(function(){
            var sizing = $(this).attr('data-size');
            $('.plotter',this).animate({'width':sizing+'%'},1500);
        });
    }

    /*-------
    Line Chart V2, Custom Code
    Dependency:
        - jquery-3.6.0.min.js
    Usage:
        - statisticscountry.html
            - Top 5 activities by companies amount in United Kingdom
    */

    // check element exist         
    if($('.line-stats-dynamic').length) {
        
        // loop through .item class, get attribute data and set as width along with the colors
        $('.line-stats-dynamic .base .item').each(function(){

            // get
            var color = $(this).attr('data-color');
            var amount = $(this).attr('data-amount');

            // set
            $(this).css({
                'background-color' : color,
                'width' : amount+"%"
            });
        });

        // loop through data attribute in list item and set the content for each region
        // data is set using attribute data-* in the list item html
        $('.line-stats-dynamic ul li').each(function(){

            // get
            var color = $(this).attr('data-color');
            var amount = $(this).attr('data-amount');
            var percentage = $(this).attr('data-percentage');

            // set
            $('.color',this).css({
                'background-color' : color
            });
            $('.count',this).html(amount);
            $('.percentage',this).html(percentage);
        });
    }

    /*-------
    Slick Sliders
    Dependency:
        - jquery-3.6.0.min.js
        - slick.min.js
    */

    // check slick attribute
    if($('[data-slickjs]').length) {

        // loop
        $('[data-slickjs]').each(function(){
            
            // get attributes settings
            var slidesToShow = parseInt($(this).attr('data-slickjs-show'));
            var slidesToScroll = parseInt($(this).attr('data-slickjs-scroll'));
            var breakpointLG = 2;
            var breakpointMD = 2;
            var breakpointSM = 1;

            // check
            if( slidesToShow > 3 ) {
                breakpointLG = slidesToShow - 1;
                breakpointMD = slidesToShow - 2;
                breakpointSM = slidesToShow - 3;
            }
            if( slidesToScroll > 1 ) {
                slidesToScroll = 1;
            }

            // initialize
            $(this).slick({
                infinite: false,
                slidesToShow: slidesToShow,
                slidesToScroll: slidesToScroll,
                prevArrow: '<button type="button" class="slick-prev"><i class="fas fa-angle-left"></i></button>',
                nextArrow: '<button type="button" class="slick-next"><i class="fas fa-angle-right"></i></button>',
                responsive: [
                    {
                      breakpoint: 1199,
                      settings: {
                        slidesToShow: breakpointLG,
                      }
                    },
                    {
                        breakpoint: 991,
                        settings: {
                          slidesToShow: breakpointMD,
                        }
                    },
                    {
                        breakpoint: 576,
                        settings: {
                          slidesToShow: breakpointSM,
                        }
                    },
                ]
            });
        });
    };

    // Sign In & Up Page
    $('.slick-features').slick({
        infinite: true,
        autoplay: true,
        autoplaySpeed: 6000,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true
    });

    
    /*-------
    Custom function to toggle filter child
    Used in the explore page on sidebar (to expand child regions/activities)
    activate by using the HTML attribute 'data-filter-toggle' and giving the target ID as a value (ID of div that you want to toggle)
    Dependency:
        - jquery-3.6.0.min.js
    */

    // check if attribute exist    
    if($("[data-filter-toggle]").length){

        // on link click
        $("[data-filter-toggle]").on('click',function(e){

            // block default event
            e.preventDefault();

            // get ID of the div we want to toggle
            var nav = $(this).attr('data-filter-toggle');
            var $button = $(this);

            // toggle, with callback to change the button +/- using the styling set in the CSS
            $(nav).toggle(200,function(){
                if($button.hasClass('showing')) {
                    $button.removeClass('showing');
                } else {
                    $button.addClass('showing');
                }
            });
        });
    }

    /*-------
    Custom function to hide/show different div in the same page
    Difference with the toggle, this function will show certain div & hide other div at the same time
    Used in the explore results (to show and hide the statistics chart/list results)
    activate by:
        - On the action button/anchor:
            - set HTML attribute 'data-filter-showhide' on the action button/anchor, and set the value to div class/id that you want to show
            - set HTML attribute 'data-filter-showhide-group' on the action button/anchor to group all the divs that you want to hide/show
        - On the target div:
            - set HTML attribute 'data-filter-target' on the target div, the value will represent the value of 'data-filter-showhide' on the action button
            - set HTML attribute 'data-filter-group' on the target div, the value will represent the value of 'data-filter-showhide-group' on the action button
    Dependency:
        - jquery-3.6.0.min.js
    */ 

    // check
    if($("[data-filter-showhide]").length) {

        // on click
        $("[data-filter-showhide]").on('click',function(e){

            // get attributes value on each button
            var nav = $(this).attr('data-filter-showhide');
            var sections = $(this).attr('data-filter-showhide-group');

            // hide all the divs within the same group
            $("[data-filter-group='" + sections + "']").hide();

            // show only the target one
            $("[data-filter-target='" + nav + "']").show();
        });
    } 

    /*-------
    Tooltip
    Dependency:
        - jquery-3.6.0.min.js
        - bootstrap.bundle.min.js
    */

    // initialize html tooltip for this chart
    $('[data-toggle="tooltip"]').tooltip();

  /*-------
    Example AMCHART
    Dependency:
        - script(src="https://cdn.amcharts.com/lib/5/index.js")
        - script(src="https://cdn.amcharts.com/lib/5/xy.js")
        - script(src="https://cdn.amcharts.com/lib/5/map.js")
        - script(src="https://cdn.amcharts.com/lib/5/geodata/continentsRussiaEuropeLow.js")
        - script(src="https://cdn.amcharts.com/lib/5/themes/Animated.js")
    Note:
        - Not use in the slicing.
    */

    /*
    var root = am5.Root.new("chart-map");
    var chart = root.container.children.push(
        am5map.MapChart.new(root, {
            panX: "none",
            minZoomLevel: 4,
            homeZoomLevel: 4,
            homeGeoPoint: { longitude: 10, latitude: 52 }
        })
    );

    var polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_continentsRussiaEuropeLow
        })
    );

    polygonSeries.events.on("datavalidated", function() {
    chart.goHome();
    });


    var root = am5.Root.new("trend-chart");

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
    am5themes_Animated.new(root)
    ]);


    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: true,
    panY: true,
    wheelX: "panX",
    wheelY: "zoomX"
    }));


    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
    behavior: "none"
    }));
    cursor.lineY.set("visible", false);


    // Generate random data
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    var value = 100;

    function generateData() {
    value = Math.round((Math.random() * 10 - 5) + value);
    am5.time.add(date, "day", 1);
    return {
        date: date.getTime(),
        value: value
    };
    }

    function generateDatas(count) {
    var data = [];
    for (var i = 0; i < count; ++i) {
        data.push(generateData());
    }
    return data;
    }


    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
    maxDeviation: 0.2,
    baseInterval: {
        timeUnit: "day",
        count: 1
    },
    renderer: am5xy.AxisRendererX.new(root, {}),
    tooltip: am5.Tooltip.new(root, {})
    }));

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererY.new(root, {})
    }));


    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    var series = chart.series.push(am5xy.LineSeries.new(root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
            labelText: "{valueY}"
        })
    }));


    // Add scrollbar
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
        orientation: "horizontal"
    }));


    // Set data
    var data = generateDatas(1200);
    series.data.setAll(data);


    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000);
    chart.appear(1000, 100);
    */
});
