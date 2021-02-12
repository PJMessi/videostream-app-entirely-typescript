abstract class Factory<T> {  
    // Provide the model class here.
	abstract model: any
    
    // Provide the random attributes for the model here.
	abstract attributes: object

    /**
     * Creates multiple instances of the model with random attributes.
     * @param numberOfInstancesToCreate For all the attributes not provided in this parameter, random 
     * values will be used.
     * @param customAttributes
     */
	createMultiple = async (numberOfInstancesToCreate: number, customAttributes?: object): Promise<T[]> => {
        const instanceList: T[] = [];
        for (let i=0; i<numberOfInstancesToCreate; i++) {
            let instance = await this.createSingle(customAttributes);
            instanceList.push(instance)
        }
        return instanceList;
	} 

    /**
     * Creates single instance of the model with random attributes.
     * @param customAttributes For all the attributes not provided in this parameter, random 
     * values will be used.
     */
    createSingle = async (customAttributes?: object): Promise<T> => {
        const finalAttributes = { ...this.attributes, ...customAttributes }
        const instance: T = await this.model.create(finalAttributes)
		return instance;
    }
}

export default Factory;