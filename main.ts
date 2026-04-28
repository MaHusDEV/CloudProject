import * as readline from 'readline-sync';
import type {Bike} from './types/bike';
import type {BikeType} from "./types/bikeType"

const urlBikeTypes: string =
  "https://raw.githubusercontent.com/MaHusDEV/dataset-webontwinkeling-2025/main/dataset/bikeTypes.json";

const urlBikes: string =
  "https://raw.githubusercontent.com/MaHusDEV/dataset-webontwinkeling-2025/main/dataset/bikes.json";

async function getData(url: string): Promise<Bike[] | BikeType[]>{
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data as Bike[] | BikeType[];
    } catch (error : any) {
        return error;
    }
}
async function main(){
    try {
        const [bikes,biketypes] = await Promise.all([
            getData(urlBikes),
            getData(urlBikeTypes)
        ]);
        console.log("Welcome to the Bikes data viewer!");

        let status:boolean = true;
        while(status){
            const choice = readline.keyInSelect(
                ["View all bikes","Filter by ID"],
                "Choose an option: "
            );
            switch(choice){
                case 0:
                    (bikes as Bike[]).forEach(bike => {
                        console.log(`
- ${bike.name} (${bike.id})
- Description: ${bike.description}
- Price: €${bike.price}
- Available: ${bike.isAvailable}
- Release Date: ${bike.releaseDate}
- Category: ${bike.category}
- Tags: ${bike.tags}
- Type: ${bike.bikeId}
`)
                    });
                break;
                case 1:
                    const id:string = readline.question("Please enter the ID you want to Filter by: ");
                    const found = (bikes as Bike[]).find(b => b.id === id);
                    if(found){
                        console.log(`
- ${found.name} (${found.id})
- Description: ${found.description}
- Price: €${found.price}
- Available: ${found.isAvailable}
- Release Date: ${found.releaseDate}
- Category: ${found.category}
- Tags: ${found.tags}
- Type: ${found.bikeId}
                            `)
                    }
                    break;
                case -1:
                    status = false;
                    console.log("Goodbye!!!");
                    break;
            }
        }
    } catch (error) {
        console.log("Error:",error);
    }
}
//main();
export { getData, urlBikeTypes, urlBikes };
