// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };


// Inner recursive function implementation
var getElementsByClassName = className => {
  var elements = [];

  var searchNodes = node => {
    if (node.classList.contains(className)) {
      elements.push(node);
    }
    
    Array.from(node.children).forEach(searchNodes);
  };

  searchNodes(document.body);
  return elements;
};


// Self invoking function implementation
var getElementsByClassName = (className,  node = document.body) => {
  var elements = [];

  if (node.classList.contains(className)) {
    elements.push(node);
  }
    
  Array.from(node.children).forEach(child => {
    elements = elements.concat(getElementsByClassName(className, child))
  });
  
  searchNodes(document.body);
  return elements;
};