// Non efficient function
var UpdateThrash = function(data) {
  // Get all the labels
  var spans = document.querySelectorAll('.item .lab');

  // We will attempt to determine the widest of our labels
  // so we can right justify the labels of our graph.
  // We are also going to change the styling (font-size).
  var colWidth = 0;
  for (var i = 0; i < spans.length; i++) {
    var span = spans[i];

    span.style.fontSize = '10px';

    colWidth = Math.max(colWidth, span.offsetWidth);
  }

  // Simply update the widths of the labels and the graphs
  for (var i = 0; i < spans.length; i++) {
    var span = spans[i],
         bar = span.nextSibling;
    span.style.width = colWidth + 'px';

    bar.style.left = colWidth + 'px';

    var w = data[i].Total * ((860 - colWidth) / 326);
    bar.style.width = w + 'px';
  }
};

//TODO:
var UpdateNoThrash = function(data) {
    
};