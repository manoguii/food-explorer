# Food Explorer

## Fluxo

Primeiro, o usuário vai acessar a aplicação através de uma tela de login. Ele vai criar a conta com o e-mail e a senha e vai entrar na conta com esse e-mail e senha criados. O usuário vai acessar uma tela home contendo todos os produtos classificados por categoria com uma opção de buscar um prato específico. O usuário vai conseguir visualizar o prato clicado contendo no prato clicado informações como imagem, título, descrição, tags associadas àquele prato específico. E vai poder incluir esse prato nos seus pedidos se ele for um usuário comum. Se o usuário for um administrador, o usuário vai poder criar pratos para o restaurante em si. O administrador poderá criar pratos adicionando nome, categoria, ingredientes do prato, preço e descrição. E se o usuário for administrador, ele também poderá editar esses pratos.

## Use Cases

- [] **Caso de Uso: Criar Conta**
  - Descrição: Um usuário pode criar uma conta na aplicação.
  - Atores: Usuário
  - Fluxo:
    1. O usuário acessa a página de registro.
    2. Insere o e-mail e a senha.
    3. O sistema valida os dados e cria uma nova conta de usuário.
    4. O usuário é redirecionado para a tela de login.

- [] **Caso de Uso: Autenticar Usuário**
  - Descrição: Um usuário pode fazer login na aplicação.
  - Atores: Usuário
  - Fluxo:
    1. O usuário acessa a página de login.
    2. Insere o e-mail e a senha.
    3. O sistema valida as credenciais.
    4. O sistema emite um token JWT após autenticação bem-sucedida.
    5. O usuário é redirecionado para a tela inicial.

- [] **Caso de Uso: Visualizar Lista de Pratos por Categoria**
  - Descrição: Os usuários podem ver uma lista de pratos classificados por categoria.
  - Atores: Usuário, Administrador
  - Fluxo:
    1. O usuário/administrador acessa a tela inicial.
    2. O sistema exibe uma lista de pratos organizados por categorias.

- [] **Caso de Uso: Buscar Prato Pelo Slug**
  - Descrição: Os usuários podem buscar um prato específico pelo nome.
  - Atores: Usuário, Administrador
  - Fluxo:
    1. O usuário/administrador insere um termo de busca.
    2. O sistema exibe resultados de pratos que correspondem à busca.

- [] **Caso de Uso: Visualizar Detalhes do Prato**
  - Descrição: Os usuários podem visualizar detalhes de um prato específico.
  - Atores: Usuário, Administrador
  - Fluxo:
    1. O usuário/administrador clica em um prato na lista.
    2. O sistema exibe informações detalhadas sobre o prato, incluindo imagem, título, descrição e tags.

- [] **Caso de Uso: Incluir Prato no Pedido**
  - Descrição: Usuários podem incluir um prato no pedido.
  - Atores: Usuário
  - Fluxo:
    1. O usuário clica em um botão para incluir o prato no pedido.
    2. O sistema adiciona o prato ao pedido do usuário.

- [] **Caso de Uso: Criar Prato (Administrador)**
  - Descrição: Administradores podem criar um novo prato.
  - Atores: Administrador
  - Fluxo:
    1. O administrador acessa a área de administração.
    2. Seleciona a opção para criar um novo prato.
    3. Preenche os detalhes do prato, incluindo nome, categoria, ingredientes, preço e descrição.
    4. O sistema valida e cria o novo prato.

- [] **Caso de Uso: Editar Prato (Administrador)**
  - Descrição: Administradores podem editar detalhes de um prato existente.
  - Atores: Administrador
  - Fluxo:
    1. O administrador acessa a área de administração.
    2. Seleciona a opção para editar um prato.
    3. Escolhe o prato a ser editado.
    4. Atualiza os detalhes do prato.
    5. O sistema valida e atualiza o prato.

Estes são alguns dos casos de uso que abrangem o fluxo que você descreveu. Lembre-se de que, durante o desenvolvimento, você pode ajustar e adicionar casos de uso conforme sua aplicação evolui e novos requisitos surgem.