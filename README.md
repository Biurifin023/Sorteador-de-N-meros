# Sorteador de Números

Aplicação web gratuita para sortear números inteiros dentro de um intervalo definido por você. Interface moderna, animação de revelação dos resultados e opção para evitar repetições.

## Como usar

1. **Abra o projeto** no navegador:
   - Abra o arquivo `index.html` diretamente, ou
   - Use a extensão **Live Server** no VS Code (recomendado para desenvolvimento local).

2. **Preencha os campos** na seção *Quero sortear*:
   - **NÚMEROS** — quantidade de números que deseja sortear (mínimo: 1).
   - **DE** — valor mínimo do intervalo (inclusivo).
   - **ATÉ** — valor máximo do intervalo (inclusivo).

3. **(Opcional)** Ative **Não repetir números** para que cada resultado seja único dentro do intervalo. Nesse modo, a quantidade solicitada não pode ser maior que o total de números disponíveis entre DE e ATÉ.

4. Clique em **SORTEAR**. Os números aparecem em blocos animados na tela. Ao final, use **SORTEAR NOVAMENTE** para repetir o sorteio com os mesmos parâmetros.

### Validações

O sorteador informa erros quando:

- algum campo não é um número inteiro;
- a quantidade é menor que 1;
- o valor **ATÉ** é menor que **DE**;
- com *Não repetir* ativo, a quantidade pedida excede o tamanho do intervalo.

### Exemplo

| Campo   | Valor |
|---------|-------|
| NÚMEROS | 5     |
| DE      | 1     |
| ATÉ     | 60    |

Com *Não repetir* desligado: cinco números entre 1 e 60, podendo repetir.  
Com *Não repetir* ligado: cinco números distintos entre 1 e 60.

## Tecnologias utilizadas

| Tecnologia | Uso no projeto |
|------------|----------------|
| **HTML5** | Estrutura semântica, formulário, regiões ARIA e acessibilidade |
| **CSS3** | Layout, variáveis CSS (`:root`), gradientes, animações e design responsivo |
| **JavaScript (Vanilla)** | Lógica do sorteio, validação, DOM e animação dos resultados |

Não há frameworks, bundlers ou dependências npm — o projeto é estático e roda apenas no navegador.

## Licença

Projeto de uso livre para fins educacionais e pessoais.
