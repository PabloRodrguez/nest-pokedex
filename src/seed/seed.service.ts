import { Injectable } from '@nestjs/common';
//import { AxiosInstance } from 'axios';
//import axios from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { log } from 'console';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { promises } from 'dns';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  //private readonly axios: AxiosInstance = axios;

  
  constructor(
        @InjectModel(Pokemon.name)
        private readonly pokemonModel: Model<Pokemon>,
        private readonly http: AxiosAdapter,
  ){}

  async executeSeed(){
    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')
    const insertPromisesArray: Promise<Pokemon>[] = [];

    data.results.forEach(({name, url}) =>{
      const segments = url.split('/');
      const no = +segments[segments.length-2]
     // const pokemon = await this.pokemonModel.create({name, no})
      
      insertPromisesArray.push(this.pokemonModel.create({name, no}))
      
      

    });
    const newArray = await Promise.all(insertPromisesArray);
    return 'Seed Executed';
  }
}
