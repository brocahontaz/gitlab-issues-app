const io = window.io('/')

console.log('client test')

io.on('event', (event) => {
  // console.log('hallelujah')
  console.log(event)

  if (event.type === 'note') {
    createNotification(event)
  } else if (event.type === 'issue') {
    switch (event.data.object_attributes.action) {
      case 'open':
        createIssue(event)
        break
      case 'update':
        updateIssue(event)
        break
      case 'close':
        closeIssue(event)
        break
      case 'reopen':
        reopenIssue(event)
        break
    }
  }
})

/**
 * @param event
 */
function createNotification (event) {

}

/**
 * @param event
 */
function createIssue (event) {
  const template = document.getElementById('issueTemplate').cloneNode(true).content
  // console.log(template.querySelector('.issue'))
  // console.log(template)
  template.querySelector('.titleLink').innerText = event.data.object_attributes.title
  template.querySelector('.openStatus').innerText = event.data.object_attributes.state
  template.querySelector('.createdAt').innerText = event.data.object_attributes.created_at
  document.querySelector('.issues').insertBefore(template, document.querySelector('.issues').children[1])
}

/**
 * @param event
 */
function updateIssue (event) {

}

/**
 * @param event
 */
function closeIssue (event) {

}

/**
 * @param event
 */
function reopenIssue (event) {

}
