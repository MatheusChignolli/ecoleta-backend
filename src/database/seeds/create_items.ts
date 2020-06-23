import Knex from 'knex';

export async function seed(knex: Knex) {
    await knex('items').insert([
        { title: "Lâmpadas", image: "lampadas.svg", darkImage: "dark-lampadas.svg", },
        { title: "Pilhas e Baterias", image: "baterias.svg", darkImage: "dark-baterias.svg", },
        { title: "Papéis e Papelão", image: "papeis-papelao.svg", darkImage: "dark-papeis-papelao.svg", },
        { title: "Resíduos Eletrônicos", image: "eletronicos.svg", darkImage: "dark-eletronicos.svg", },
        { title: "Resíduos Orgânicos", image: "organicos.svg", darkImage: "dark-organicos.svg", },
        { title: "Óleo de Cozinha", image: "oleo.svg", darkImage: "dark-oleo.svg", },
    ])
}