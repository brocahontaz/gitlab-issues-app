const io = window.io('/')

console.log('client test')

io.on('event', (event) => {
  // console.log('hallelujah')
  console.log(event)

  if (event.type === 'note') {
    createNotification(event)
  } else if (event.type === 'issue') {
    switch (event.action) {
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
  console.log(template)
  template.querySelector('.issue').id = event.data.id

  template.querySelector('.titleLink').setAttribute('src', event.data.url)
  template.querySelector('.titleLink').innerText = event.data.title
  template.querySelector('.openStatus').innerText = event.data.state

  template.querySelector('.author').setAttribute('src', event.data.authorUrl)

  const authorNode = document.createTextNode(event.data.author)
  template.querySelector('.author').insertBefore(authorNode, template.querySelector('.author').firstChild)
  template.querySelector('.avatar').setAttribute('src', event.data.authorAvatar)

  template.querySelector('.createdAt').innerText = event.data.createdAt
  template.querySelector('.updatedAt').innerText = event.data.updatedAt

  template.querySelector('.description').innerText = event.data.description

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
