import { updateChart } from "./chart.js";
import { displayBestCombination } from "./ui.js";

/**
 * Genethic algorithm implementation
 *
 * @class GA
 */
class GA {

    /**
     * Creates an instance of GA.
     * @param {Object} items fenotype of current optimization problem
     * @param {Number} [populationCap=25] number of max population inside one generation
     * @param {Number} [maxCapacity=400] parameter for current optimization problem - effects fitness function
     * @param {Number} [maxGeneration=100] max number of iterations of evolution process
     * @memberof GA
     */
    constructor(items, populationCap = 25, maxCapacity = 400, maxGeneration = 100) {
        this.items = items;
        this._generation = 0;
        this._population = [];
        this._newPopulation = [];
        this.populationCap = populationCap;
        this.maxCapacity = maxCapacity;
        this.maxGeneration = maxGeneration;
    }

    init() {
        console.log("Good Luckkkk !");
        console.log(this.items);

        this.createInitialPopulation(this.items, this.populationCap);
        console.log(this._population);
        while(this._generation < this.maxGeneration){
            for(let i = 0; i < 13; i++){
                let parents = this.tournamentSelection(this._population);
                let childrenGenes = this.Reproduce(parents[0].gene, parents[1].gene);
                let child1 = this.bitFlipMutation(childrenGenes[0]);
                let child2 = this.bitFlipMutation(childrenGenes[1])
                this._newPopulation.push(child1, child2);
            }    
            this._population = this.miAlfaMutation(this._population, this._newPopulation, this.populationCap);
            this._newPopulation = [];
            let fitnessMean = 0
            let fitnessOverall = 0;
            for(let index = 0; index < this._population.length; index++){
                fitnessOverall += this._population[index].fitness
            }
            fitnessMean = fitnessOverall/this._population.length;
            updateChart(fitnessMean,this._generation)
            this._generation++;
        } 
        console.log(this._population);
        let youShouldBring = this._population[0];
        displayBestCombination(youShouldBring, this.items);
    }

    createInitialPopulation(items,numberOfChildren){
        const newGenes=[]
        let fitness;
        let gene;
        for(let i=0; i<numberOfChildren; i++){
            do{
                gene = Array.from({length:items.length},() => Math.floor(Math.random()*2))
                fitness = this.fitnessOfIndividual(gene, this.maxCapacity,items)
            }
            while(fitness === 0);
            const item = {
                generation:0,
                gene:gene,
                fitness:fitness

            }
            this._population.push(item)
        }
        return this._population
    }

    fitnessOfIndividual(gene, maxCapacity, items){
        let fitness = 0;
        let weightOfIndividual = 0;
        gene.forEach((el,index)=>{
            if(el===1){
                fitness+=items[index].value;
                weightOfIndividual += items[index].weight;
            }
        })
        if(weightOfIndividual > maxCapacity) fitness = 0; 
        return fitness;
    }

    tournamentSelection(population) {
        const parents = [];
        const sortedItems = population.sort((a,b)=>{
            return b.fitness-a.fitness;
        })
        let parent1 = sortedItems[0];
        let parent2 = sortedItems[1];
        parents.push(parent1, parent2);
        return parents;
    }

    Reproduce(geneOfFirstParent,geneOfSecondParent){
        let geneOfFirstChild = []
        let geneOfSecondChild = []
        let willReproduce = Math.random();
        
        if(willReproduce < 0.75){
            let min = 1;
            let max = geneOfFirstParent.length - 2; 
            let cross = Math.floor(Math.random() * (max - min + 1)) + min;
            for(let i = 0; i < cross; i++){
                geneOfFirstChild[i] = geneOfFirstParent[i];
                geneOfSecondChild[i] = geneOfSecondParent[i];
            }
            for(let i = cross; i < geneOfFirstParent.length; i++){
                geneOfFirstChild[i] = geneOfSecondParent[i];
                geneOfSecondChild[i] = geneOfFirstParent[i];
            }
        }
        else{
            geneOfFirstChild = geneOfFirstParent;
            geneOfSecondChild = geneOfSecondParent;
        }
        let childGenes = [];
        
        childGenes.push(geneOfFirstChild, geneOfSecondChild);
        return childGenes;
    }
    
    bitFlipMutation(childGenes){
        for(let i = 0; i < childGenes.length; i++){
            let willMutate = Math.random();
            if(willMutate > 0.1){
                if(childGenes[i] === 0) childGenes[i] = 1;
                else if(childGenes[i] === 1) childGenes[i] = 0;
            }
        }
        let child = {
            generation:this._generation,
            gene:childGenes,
            fitness:this.fitnessOfIndividual(childGenes, this.maxCapacity, this.items),
        }    
        return child;
    }

    miAlfaMutation(thisPopulation,newPolupation,count){
        const joinedPopulation = thisPopulation.concat(newPolupation);
        joinedPopulation.sort((a,b)=>{
            return b.fitness-a.fitness;
        })
        return joinedPopulation.slice(0, count)
    }

}

export { GA };
