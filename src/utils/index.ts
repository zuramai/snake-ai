export const randomNumberBetween = (min: number, max: number) => {
    return Math.random() * (max - min) + min
}

export const randomGaussian = (mean: number, standardDeviation: number) => {
    // Default values if not provided
    mean = mean || 0;
    standardDeviation = standardDeviation || 1;
   
    // Generate two uniform random numbers
    var u1 = Math.random();
    var u2 = Math.random();
   
    // Box-Muller transform
    var z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
   
    // Return a random number from the Gaussian distribution
    return z0 * standardDeviation + mean;
}