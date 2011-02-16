/*
 * Formats a unixtime into a specific format.
 * 18th of April 2011 at 13:40pm
 */
function format_unixtime(unixtime, format) {
    
    var date = new Date(unixtime * 1000);
    
    if (format == "html5") {
        format = "yyyy-mm-ddThh:ii-00:00";
    }

    if (format == "microformat") {
        format = "yyyy-mm-ddThh:ii-0000";
    }

    if (format == "human") {
        format = "DD of MM yyyy at hh:ii";
    }

    format = format.replace(RegExp("yyyy","g"),  date.getFullYear().toString());
    format = format.replace(RegExp("mm"  ,"g"),  addZero(date.getMonth() + 1));
    format = format.replace(RegExp("dd"  ,"g"),  addZero(date.getDate()));
    format = format.replace(RegExp("DD"  ,"g"),  human_day(date));
    format = format.replace(RegExp("MM"  ,"g"),  human_month(date));
    format = format.replace(RegExp("ii"  ,"g"),  date.getMinutes().toString());
    format = format.replace(RegExp("hh"  ,"g"),  date.getHours().toString());
    
    return format;

}

function addZero(num)
{
    (String(num).length < 2) ? num = String("0" + num) :  num = String(num);
    return num;		
}

function human_month (date) {
    switch(date.getMonth())
    {
    case 0:
        return "January";
        break;
    case 1:
        return "February";
        break;
    case 2:
        return "March";
        break;
    case 3:
        return "April";
        break;
    case 4:
        return "May";
        break;
    case 5:
        return "June";
        break;
    case 6:
        return "July";
        break;
    case 7:
        return "August";
        break;
    case 8:
        return "September";
        break;
    case 9:
        return "October";
        break;
    case 10:
        return "November";
        break;
    case 11:
        return "December";
        break;
    default:
        return "January";
        break;
    }
    return "January";
}

function human_day (date) {
    
    var ending = "th";

    var day = date.getDate();

    if (
        day == 1 ||
        day == 21 ||
        day == 31
    ) {
        ending = "st";
    } else if (
        day == 2 ||
        day == 22
    ) {
        ending = "nd";
    } else if (
        day == 3 ||
        day == 23
    ) {
        ending = "rd";
    }

    return day + ending;

}
