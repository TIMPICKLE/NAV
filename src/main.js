const $siteList = $('.siteList')
const $lastLi = $siteList.find('li.last')
const x = localStorage.getItem('x')
const xObject = JSON.parse(x)
const hashMap = xObject || [
  {logo: 'A', url: 'https://www.acfun.cn'},
  {logo: 'B', url: 'https://www.bilibili.com'}
]
const simplifyUrl = (url) => {
  return url.replace('https://', '')
    .replace('http://', '')
    .replace('www.', '')
    .replace(/\/.*/, '') // 删除 / 开头的内容
    // 正则表达式的内容 
}

const render = () => {//使用jq找到li标签 但不是最后一个 然后删除
  $siteList.find('li:not(.last)').remove()
  hashMap.forEach((node, index) => {
      //先使用jQuery创建 一个li标签
      //特别注意这里面的 是 插值表达式
    const $li = $(`<li>
      <div class="site">
        <div class="logo">${node.logo}</div>
        <div class="link">${simplifyUrl(node.url)}</div>
        <div class="close">
          <svg class="icon">
            <use xlink:href="#icon-close"></use>
          </svg>
        </div>
      </div>
    </li>`).insertBefore($lastLi)
    $li.on('click', () => {
      window.open(node.url)
    })
    $li.on('click', '.close', (e) => {
      e.stopPropagation() // 阻止冒泡
      hashMap.splice(index, 1)
      render()
    })
  })
}

render()

$('.addButton').on('click', () => {
  let url = window.prompt('添加的网址？')
  if (url.indexOf('http') !== 0) {
    url = 'https://' + url
  }
  console.log(url)
  hashMap.push({
    logo: simplifyUrl(url)[0].toUpperCase(),
    url: url
  })
  render()
})

window.onbeforeunload = () => {
  const string = JSON.stringify(hashMap)
  localStorage.setItem('x', string)
}

$(document).on('keypress', (e) => {
  const {key} = e
  for (let i = 0; i < hashMap.length; i++) {
    if (hashMap[i].logo.toLowerCase() === key) {
      window.open(hashMap[i].url)
    }
  }
})