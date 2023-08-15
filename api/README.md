# Food Explorer

Domain -> Camada desconectada de todas camadas externas do app 
Core -> Camada compartilhada entre todas entidades da aplicação 

O food explorer terá duas personas: o `admin` e o `usuário`;

- Admin:
    É a pessoa responsável pelo restaurante, logo, poderá criar, visualizar, editar e apagar um `prato` a qualquer momento. Cada prato deve conter uma imagem, um nome, uma categoria, uma breve descrição, os ingredientes e o seu preço. Ao clicar em adicionar prato, o admin receberá uma mensagem de sucesso e será redirecionado para a página principal;

- Usuário:
    Irá visualizar todos os pratos cadastrados e, quando clicar em um prato, será redirecionado para uma nova tela com informações mais detalhadas sobre ele.

1. **Entidades:**
    - Prato
2. **Value Objects:**
    - Slug: Pode ser um value object, pois é uma parte importante do Prato, mas não precisa ser uma entidade separada com identidade própria.
