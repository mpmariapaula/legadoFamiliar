Crie uma aplicação web completa chamada **“Legado da Família”**, com o objetivo de preservar a história, as pessoas, os relacionamentos, as fotografias e as memórias de uma família ao longo de várias gerações.

A aplicação deve ter aparência de um **livro de família digital**, elegante, acolhedora, afetiva e ao mesmo tempo moderna. A ideia é que, no futuro, o conteúdo cadastrado possa também ser organizado e exportado para um **livro em PDF**, permitindo transformar o acervo digital em um livro físico ou digital.

## 1. CONCEITO DO SISTEMA

O sistema deverá permitir:

* Cadastrar pessoas da família.
* Registrar informações biográficas.
* Definir relações de parentesco entre as pessoas.
* Organizar as pessoas por gerações.
* Criar uma árvore genealógica.
* Adicionar fotografias às pessoas.
* Criar álbuns ou registros fotográficos.
* Registrar histórias e memórias da família.
* Registrar acontecimentos importantes.
* Pesquisar pessoas.
* Visualizar a trajetória de uma pessoa dentro da família.
* Navegar entre parentes através dos relacionamentos.
* Ter uma visão geral da família.
* Futuramente gerar um PDF estruturado como um livro de família.

O sistema deve ser pensado para crescer ao longo do tempo e armazenar informações de muitas gerações.

---

# 2. TECNOLOGIA

Utilizar inicialmente:

* HTML5
* CSS3
* JavaScript
* Supabase como banco de dados e armazenamento de imagens.

Preferencialmente utilizar uma arquitetura simples, organizada e fácil de manter.

Se for necessário utilizar uma linguagem adicional para facilitar a aplicação, pode utilizar PHP, mas priorize uma solução simples e compatível com hospedagem comum.

O banco de dados deverá utilizar **Supabase PostgreSQL**.

As fotografias deverão ser armazenadas utilizando o **Supabase Storage**, e não diretamente dentro do banco de dados.

Separar claramente:

* estrutura da aplicação;
* estilos;
* scripts;
* configuração do Supabase;
* componentes reutilizáveis.

Criar um arquivo de configuração onde seja fácil inserir:

* URL do projeto Supabase;
* chave pública do Supabase.

Nunca expor chaves privadas ou service_role no código do navegador.

---

# 3. IDENTIDADE VISUAL

Criar um design inspirado em um **livro antigo de família**, mas sem deixar o sistema com aparência velha ou pesada.

A identidade visual deve transmitir:

* família;
* memória;
* carinho;
* tradição;
* história;
* união;
* continuidade entre gerações;
* alegria.

### Paleta de cores

Utilizar principalmente tons de marrom, bege, creme e terracota.

Sugestão:

* Marrom escuro: #4A2C20
* Marrom médio: #795548
* Caramelo: #A67C52
* Bege: #E8D8C3
* Creme: #F8F1E7
* Terracota: #C9795B
* Verde suave opcional: #7A8B68

Utilizar cores alegres como pontos de destaque, mas manter o marrom como identidade principal.

Evitar aparência excessivamente corporativa.

---

# 4. TIPOGRAFIA

Combinar duas famílias tipográficas:

Uma fonte serifada elegante para títulos, remetendo a livros antigos.

Uma fonte sem serifa para textos, menus, formulários e informações.

Os títulos podem ter aparência semelhante a:

“Legado da Família”

“Uma história construída por muitas gerações”

“Memórias que permanecem”

---

# 5. PÁGINA INICIAL

Criar uma página inicial emocional e elegante.

Hero principal:

**Legado da Família**

Subtítulo:

**“Uma história construída por muitas gerações.”**

Apresentar uma fotografia familiar em destaque ou uma composição com várias fotografias.

Adicionar botão:

**Explorar nossa história**

E botão:

**Adicionar familiar**

A página inicial também pode apresentar:

* número de pessoas cadastradas;
* número de gerações;
* quantidade de fotografias;
* quantidade de histórias registradas.

Exemplo:

**6 gerações**
**87 pessoas**
**142 fotografias**
**23 histórias**

Esses números devem ser obtidos dinamicamente do banco de dados.

---

# 6. MENU PRINCIPAL

Criar um menu simples:

* Início
* Nossa História
* Pessoas
* Árvore Familiar
* Fotografias
* Memórias
* Acontecimentos
* Administração

No celular, transformar o menu em menu hambúrguer.

---

# 7. CADASTRO DE PESSOAS

Criar um CRUD completo para pessoas.

Campos:

* ID
* Nome
* Nome completo
* Apelido
* Data de nascimento
* Local de nascimento
* Data de falecimento
* Local de falecimento
* Biografia
* Profissão
* Cidade onde viveu
* Geração
* Foto principal
* Observações
* Data de criação
* Data de atualização

Também permitir indicar:

* pessoa viva;
* pessoa falecida.

Não tornar campos obrigatórios informações que podem não ser conhecidas.

---

# 8. RELACIONAMENTOS FAMILIARES

Criar uma estrutura específica para representar relações entre pessoas.

Exemplos:

* pai
* mãe
* filho
* filha
* avô
* avó
* neto
* neta
* irmão
* irmã
* tio
* tia
* sobrinho
* sobrinha
* primo
* prima
* esposo
* esposa
* companheiro
* companheira

O sistema deve permitir selecionar duas pessoas e estabelecer uma relação entre elas.

Exemplo:

Maria é mãe de João.

João é filho de Maria.

O sistema deve evitar a necessidade de cadastrar manualmente as duas relações quando elas forem inversas.

---

# 9. ÁRVORE GENEALÓGICA

Criar uma página específica chamada:

**Árvore Familiar**

Apresentar os familiares visualmente conectados.

Cada pessoa deve aparecer em um cartão contendo:

* fotografia;
* nome;
* datas;
* geração.

As relações devem ser representadas por linhas.

Ao clicar em uma pessoa, abrir sua ficha familiar.

A árvore deve permitir:

* zoom;
* movimentação;
* navegação;
* visualizar diferentes gerações;
* pesquisar uma pessoa;
* centralizar a árvore em determinada pessoa.

A estrutura deve ser preparada para receber muitas gerações.

---

# 10. PERFIL DA PESSOA

Ao clicar em uma pessoa, abrir uma página detalhada.

Exemplo:

## Maria da Silva

**1920 – 2005**

Fotografia principal.

Seções:

### Sobre ela

Biografia.

### Família

Mostrar:

* pais;
* irmãos;
* esposo(a);
* filhos;
* netos.

### Fotografias

Galeria de fotos relacionadas à pessoa.

### Memórias

Histórias relacionadas à pessoa.

### Acontecimentos

Eventos importantes relacionados à pessoa.

Criar navegação para clicar nos parentes e acessar seus respectivos perfis.

---

# 11. FOTOGRAFIAS

Criar uma área:

**Galeria da Família**

Permitir:

* adicionar foto;
* título;
* descrição;
* data aproximada;
* local;
* pessoas presentes;
* geração;
* álbum.

As imagens deverão ser armazenadas no Supabase Storage.

Criar uma galeria visual bonita, semelhante a um álbum de família.

Ao clicar na fotografia, abrir visualização ampliada.

Permitir relacionar uma mesma fotografia a várias pessoas.

---

# 12. ÁLBUNS

Criar possibilidade de organizar fotografias em álbuns.

Exemplos:

* Família dos avós
* Infância
* Casamentos
* Aniversários
* Natal
* Viagens
* Reuniões de família
* Família atual
* Fotografias antigas

Cada álbum poderá possuir:

* título;
* descrição;
* capa;
* data;
* fotografias.

---

# 13. MEMÓRIAS E HISTÓRIAS

Criar uma seção chamada:

**Memórias da Família**

Permitir cadastrar histórias.

Campos:

* título;
* texto;
* data ou período;
* local;
* pessoas relacionadas;
* autor do relato;
* fotografias.

Exemplos:

“Como os avós se conheceram”

“A história da nossa primeira casa”

“O casamento dos nossos avós”

“Os domingos em família”

“Uma lembrança inesquecível”

As histórias devem possuir aparência semelhante a páginas de um livro.

---

# 14. ACONTECIMENTOS

Criar uma linha do tempo familiar.

Título:

**Nossa História**

Exibir acontecimentos cronologicamente.

Exemplos:

1920 — Nascimento do patriarca.

1945 — Casamento.

1950 — Nascimento do primeiro filho.

1970 — Mudança para outra cidade.

1995 — Primeiro grande encontro da família.

2026 — Criação do Legado da Família.

Cada acontecimento poderá conter:

* título;
* descrição;
* data;
* local;
* pessoas relacionadas;
* fotografia.

---

# 15. BUSCA

Criar uma busca global.

O usuário poderá pesquisar:

* nome;
* apelido;
* cidade;
* profissão;
* geração;
* histórias;
* acontecimentos.

Os resultados devem ser organizados por categoria.

---

# 16. ADMINISTRAÇÃO

Criar uma área administrativa para gerenciamento do conteúdo.

Funcionalidades:

* cadastrar pessoa;
* editar pessoa;
* excluir pessoa;
* cadastrar relacionamento;
* cadastrar fotografia;
* cadastrar álbum;
* cadastrar memória;
* cadastrar acontecimento.

Adicionar confirmações antes de exclusões.

Exemplo:

“Tem certeza de que deseja excluir esta pessoa?”

---

# 17. BANCO DE DADOS SUPABASE

Criar estrutura de banco preparada para crescimento.

Sugestão de tabelas:

### people

* id
* full_name
* nickname
* birth_date
* birth_place
* death_date
* death_place
* biography
* profession
* residence
* generation
* is_alive
* main_photo_url
* notes
* created_at
* updated_at

### relationships

* id
* person_id
* related_person_id
* relationship_type
* created_at

### photos

* id
* title
* description
* photo_url
* date
* location
* album_id
* created_at

### photo_people

Tabela intermediária para relacionar várias pessoas a uma fotografia.

* photo_id
* person_id

### albums

* id
* title
* description
* cover_photo_url
* created_at

### memories

* id
* title
* content
* date
* location
* author
* created_at
* updated_at

### memory_people

* memory_id
* person_id

### events

* id
* title
* description
* event_date
* location
* created_at

### event_people

* event_id
* person_id

---

# 18. SEGURANÇA

Utilizar Supabase Auth para autenticação administrativa.

Apenas usuários autenticados poderão:

* adicionar pessoas;
* editar pessoas;
* excluir pessoas;
* adicionar fotografias;
* alterar relacionamentos;
* criar memórias.

A área pública poderá visualizar o conteúdo conforme as regras definidas.

Utilizar Row Level Security (RLS) no Supabase.

Não deixar operações administrativas abertas ao público.

---

# 19. RESPONSIVIDADE

O sistema deve funcionar perfeitamente em:

* computador;
* notebook;
* tablet;
* celular.

Priorizar uma excelente experiência no celular, pois familiares poderão acessar o site pelo smartphone.

---

# 20. EXPERIÊNCIA DO USUÁRIO

A navegação deve ser extremamente simples.

O sistema deve parecer um livro que pode ser explorado.

Utilizar elementos visuais como:

* cartões;
* molduras de fotografias;
* linhas do tempo;
* árvores;
* separadores;
* pequenas ilustrações decorativas;
* elementos inspirados em papel;
* cantos arredondados;
* sombras suaves.

Não exagerar nos efeitos.

A estética deve transmitir **afeto e memória**, não parecer um sistema empresarial.

---

# 21. FUTURA EXPORTAÇÃO PARA PDF

Não é necessário implementar agora a geração de PDF, mas toda a arquitetura deve ser preparada para isso.

No futuro deverá ser possível gerar:

**“Livro do Legado da Família”**

com:

* capa;
* apresentação da família;
* árvore genealógica;
* gerações;
* perfis das pessoas;
* fotografias;
* histórias;
* linha do tempo;
* acontecimentos.

O PDF deverá possuir aparência de livro impresso.

Portanto, estruturar os dados desde o início de maneira organizada para facilitar essa futura funcionalidade.

---

# 22. DADOS DE EXEMPLO

Criar alguns dados fictícios para demonstração.

Exemplo:

Geração 1:

* Antônio
* Maria

Geração 2:

* João
* Ana
* José

Geração 3:

* Carlos
* Fernanda
* Pedro

Não utilizar dados reais.

Criar relacionamentos entre essas pessoas para que a árvore genealógica possa ser demonstrada imediatamente.

---

# 23. DASHBOARD

Criar um painel administrativo com:

**Legado da Família**

Cards:

* Pessoas
* Gerações
* Fotografias
* Álbuns
* Memórias
* Acontecimentos

Adicionar pequenos gráficos ou indicadores quando fizer sentido.

Também mostrar:

**Últimas pessoas cadastradas**

**Últimas fotografias**

**Últimas memórias**

---

# 24. ESTRUTURA DO PROJETO

Entregar o projeto organizado, pronto para execução.

Exemplo:

/legado-familia

index.html

/pages
pessoas.html
pessoa.html
arvore.html
fotografias.html
memorias.html
acontecimentos.html
admin.html

/css
style.css
responsive.css

/js
app.js
supabase.js
pessoas.js
arvore.js
fotografias.js
memorias.js
acontecimentos.js

/assets
/images
/icons

/database
schema.sql
seed.sql

README.md

---

# 25. README

Criar um README.md detalhado explicando:

1. Como criar o projeto no Supabase.
2. Como criar as tabelas.
3. Como executar o schema SQL.
4. Como configurar o Storage.
5. Como configurar autenticação.
6. Onde inserir a URL do Supabase.
7. Onde inserir a chave pública.
8. Como executar o projeto localmente.
9. Como publicar o projeto.
10. Como cadastrar o primeiro usuário administrador.

As instruções devem ser voltadas para uma pessoa que possui conhecimentos básicos de desenvolvimento web.

---

# 26. RESULTADO ESPERADO

O resultado deve ser um sistema funcional, bonito e organizado, e não apenas um protótipo visual.

Priorizar:

* funcionamento real do CRUD;
* integração real com Supabase;
* upload real de fotografias;
* relacionamentos entre pessoas;
* árvore genealógica;
* responsividade;
* organização do código;
* facilidade de manutenção;
* possibilidade de expansão futura.

O objetivo final é transformar o sistema em um verdadeiro **livro digital da história da família**, preservando não apenas nomes e datas, mas também fotografias, histórias, acontecimentos e memórias para que futuras gerações possam conhecer suas origens.

O projeto deve ter uma sensação emocional de:

**“Aqui estão as pessoas que vieram antes de nós, as histórias que viveram e o legado que deixaram.”**
