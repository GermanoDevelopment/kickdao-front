# Flow

Mermaid flow chart

graph TD
  A[Home] --> B[Explorar Projetos]
  A --> C[Conectar Carteira]

  C --> D{Possui NFT?}
  D -- Sim --> E[Dashboard do Usuário]
  D -- Não --> B

  B --> F[Ver Projeto]
  F --> G[Comprar Ações]

  E --> H[Projetos Apoiados]
  E --> I[Projetos Criados]
  E --> J[Criar Projeto]

  J --> K[Formulário de Criação]
  K --> L[Deploy de Projeto]

  E --> M[Governança]
  M --> N[Ver Propostas]
  M --> O[Votar]

  style A fill:#f9f,stroke:#333,stroke-width:2px
  style E fill:#bbf,stroke:#333,stroke-width:2px
  style F fill:#afa,stroke:#333,stroke-width:2px
