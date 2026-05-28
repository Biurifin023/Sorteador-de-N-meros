const form = document.getElementById('sorteador-form')
const inputNumeros = document.getElementById('numeros')
const inputDe = document.getElementById('de')
const inputAte = document.getElementById('ate')
const inputNaoRepetir = document.getElementById('nao-repetir')
const statusEl = document.getElementById('draw-status')
const successEl = document.getElementById('draw-success')
const drawResults = document.getElementById('draw-results')
const drawResultsList = document.getElementById('draw-results-list')
const drawResultsSummary = document.getElementById('draw-results-summary')
const drawAgain = document.getElementById('draw-again')
const btnSortearNovamente = document.getElementById('btn-sortear-novamente')

const DRAW_TOTAL_DURATION = 8000
const DRAW_NUMBER_CYCLE_INTERVAL = 80

let activeDrawTimers = []
let activeDrawIntervals = []

function clearDrawAnimation() {
    activeDrawTimers.forEach((id) => window.clearTimeout(id))
    activeDrawIntervals.forEach((id) => window.clearInterval(id))
    activeDrawTimers = []
    activeDrawIntervals = []
}

function notInteger(value) {
    return !Number.isInteger(value)
}

function numeroAleatorio(minimo, maximo) {
    return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo
}

function sortearComRepeticao(quantidade, minimo, maximo) {
    const resultados = []

    for (let i = 0; i < quantidade; i++) {
        resultados.push(numeroAleatorio(minimo, maximo))
    }

    return resultados
}

function sortearSemRepeticao(quantidade, minimo, maximo) {
    const pool = []

    for (let n = minimo; n <= maximo; n++) {
        pool.push(n)
    }

    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }

    return pool.slice(0, quantidade)
}

function sortearNumeros(quantidade, minimo, maximo, naoRepetir) {
    if (naoRepetir) {
        return sortearSemRepeticao(quantidade, minimo, maximo)
    }

    return sortearComRepeticao(quantidade, minimo, maximo)
}

function validarFormulario() {
    const quantidade = inputNumeros.valueAsNumber
    const minimo = inputDe.valueAsNumber
    const maximo = inputAte.valueAsNumber
    const naoRepetir = inputNaoRepetir.checked

    statusEl.textContent = ''
    successEl.textContent = ''

    const campos = [
        { input: inputNumeros, valor: quantidade, nome: 'NÚMEROS' },
        { input: inputDe, valor: minimo, nome: 'DE' },
        { input: inputAte, valor: maximo, nome: 'ATÉ' },
    ]

    for (const { input, valor, nome } of campos) {
        if (notInteger(valor)) {
            statusEl.textContent = `O campo ${nome} deve ser um número inteiro.`
            input.focus()
            return null
        }
    }

    if (quantidade < 1) {
        statusEl.textContent = 'Informe pelo menos 1 número para sortear.'
        inputNumeros.focus()
        return null
    }

    if (minimo > maximo) {
        statusEl.textContent = 'O campo ATÉ deve ser maior que DE!'
        inputAte.focus()
        return null
    }

    const tamanhoIntervalo = maximo - minimo + 1

    if (naoRepetir && quantidade > tamanhoIntervalo) {
        statusEl.textContent =
            `Com "Não repetir", o máximo é ${tamanhoIntervalo} número(s) entre ${minimo} e ${maximo}.`
        inputNumeros.focus()
        return null
    }

    return { quantidade, minimo, maximo, naoRepetir }
}

function getTileRevealDelay(index, total) {
    if (total === 1) {
        return DRAW_TOTAL_DURATION
    }

    return Math.round((DRAW_TOTAL_DURATION / total) * (index + 1))
}

function exibirResultados(numeros, minimo, maximo) {
    clearDrawAnimation()

    drawResultsList.innerHTML = ''
    drawResults.classList.remove('hidden', 'is-animating')
    drawResultsSummary.textContent = `Sorteando ${numeros.length} número(s)...`

    const tiles = numeros.map((numero, index) => {
        const tile = document.createElement('div')
        tile.className = 'number-tile is-animating'
        tile.style.setProperty('--tile-index', index)
        tile.setAttribute('role', 'listitem')

        const value = document.createElement('span')
        value.className = 'number-tile__value'
        value.textContent = numeroAleatorio(minimo, maximo)
        tile.appendChild(value)
        drawResultsList.appendChild(tile)

        return { tile, value, numero }
    })

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
        tiles.forEach(({ tile, value, numero }) => {
            value.textContent = numero
            tile.classList.remove('is-animating')
            tile.classList.add('is-revealed')
        })
        drawResultsSummary.textContent =
            `Sorteados ${numeros.length} número(s): ${numeros.join(', ')}.`
        return
    }

    drawResults.classList.add('is-animating')

    tiles.forEach(({ tile, value, numero }, index) => {
        const intervalId = window.setInterval(() => {
            value.textContent = numeroAleatorio(minimo, maximo)
        }, DRAW_NUMBER_CYCLE_INTERVAL)
        activeDrawIntervals.push(intervalId)

        const timeoutId = window.setTimeout(() => {
            window.clearInterval(intervalId)
            activeDrawIntervals = activeDrawIntervals.filter((id) => id !== intervalId)

            value.textContent = numero
            tile.classList.remove('is-animating')
            tile.classList.add('is-revealed')

            if (index === tiles.length - 1) {
                drawResults.classList.remove('is-animating')
                drawResultsSummary.textContent =
                    `Sorteados ${numeros.length} número(s): ${numeros.join(', ')}.`
            }
        }, getTileRevealDelay(index, tiles.length))

        activeDrawTimers.push(timeoutId)
    })
}

function executarSorteio() {
    const dados = validarFormulario()

    if (!dados) {
        return
    }

    const { quantidade, minimo, maximo, naoRepetir } = dados
    const numerosSorteados = sortearNumeros(quantidade, minimo, maximo, naoRepetir)

    successEl.textContent = `${numerosSorteados.length} número(s) sorteado(s) com sucesso!`
    exibirResultados(numerosSorteados, minimo, maximo)
    drawAgain.classList.remove('hidden')
}

form.addEventListener('submit', (event) => {
    event.preventDefault()
    executarSorteio()
})

btnSortearNovamente.addEventListener('click', executarSorteio)
