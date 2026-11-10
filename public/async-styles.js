// Loads third-party stylesheets without blocking first paint. External file
// because the CSP (script-src 'self') forbids inline onload handlers.
;[
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
].forEach(function (href) {
  var link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
})
