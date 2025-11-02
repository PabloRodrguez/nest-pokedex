/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Query } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/Pagination.dto';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto)
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(
    paginationDto: PaginationDto
  ) {
    const { limit = 10, offset = 0} = paginationDto
    return this.pokemonModel.find()
    .limit( limit )
    .skip( offset)
    .sort({
      no:1
    })
    .select('-__v')
    ;
  }

  async findOne(term: string) {
    let pokemon: Pokemon | null = null;

    //buscar por numero de pokemon (pokedex)

    if(!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({no: term})
    }

    //buscar por MongoID
    if( !pokemon && isValidObjectId(term)){
      let searchId = term.trim();
      pokemon = await this.pokemonModel.findById(searchId)
    }

    //buscar por Name
    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({name: term.toLowerCase().trim()})

    }

    if (!pokemon) throw new NotFoundException(`Pokemon with id, name or no "${term}" not found`)

    return pokemon
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if(updatePokemonDto.name){
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }
    //validar que el id que estoy actualizando no exista, si existe lanzar error
    try {
      await pokemon.updateOne(updatePokemonDto)
      return {...pokemon.toJSON(), ...updatePokemonDto};
    } catch (error) {
      this.handleExceptions(error);
    }

  }

  async remove(id: string) {
    //const pokemon = await this.findOne(id) 
    //await pokemon.deleteOne()
    //const result = await this.pokemonModel.findByIdAndDelete(id)
    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id});
    if(deletedCount === 0){
      throw new BadRequestException(`Pokemon with id "${id}" not found`)
    }
    return `Pokemon with id "${id}" deleted succesfully`;
  }


  private handleExceptions(error: any){
    if(error.code === 11000){
        throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyvalue)}`)
      }
      throw new InternalServerErrorException(`Can't update Pokemon - check server logs `)
  }
}
