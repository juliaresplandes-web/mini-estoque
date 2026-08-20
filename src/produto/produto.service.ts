import { Injectable } from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { ConflictException } from '@nestjs/common';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProdutoService {
  constructor(private prisma: PrismaService) {

  }
  async criar(dados: CreateProdutoDto) {
    const produtoExistente = await this.prisma.produto.findFirst({
      where: { nome: dados.nome }

    })
    if (produtoExistente) {
      throw new ConflictException("Já existe um produto com este nome  ")
    }
    return this.prisma.produto.create({
      data: dados
    })
  }

  listarTodos() {
    return this.prisma.produto.findMany();
  }

  async buscarPorID(id: number) {
    const produto = await this.prisma.produto.findUnique({
      where: { id }
    });
    if (!produto) {
      throw new ConflictException(`Produto com o ID ${id} mão foi encontrado`)
    }
    return produto;
  }
async atualizar(id: number, dados: UpdateProdutoDto) {
  await this.buscarPorID(id);

  if (dados.nome) {
    const igual = await this.prisma.produto.findFirst({
      where: {
        nome: dados.nome,
        NOT: { id }
      }
    });
    if (igual) {
      throw new ConflictException('Já existe um produto cadastrado com este nome.');
    }
  }

  return this.prisma.produto.update({
    where: { id },
    data: dados
  });
}

  async deletar(id: number) {
    await this.buscarPorID(id);
    return this.prisma.produto.delete({
      where: { id }
    });
  }
}      

