function createButton (id, cb) {
	var el = document.querySelector(id)
	if (!el) return
	typeof cb === 'function' && el.addEventListener('click', cb, false)
	return el
}

function createSlider () {

}

export { createButton, createSlider }