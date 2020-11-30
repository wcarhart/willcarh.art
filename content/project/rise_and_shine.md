# A more efficient way to wake up.

### A fun embedded project
Rise and Shine was my final project for one my university embedded courses. We used a [Microchip PIC18F4321](https://www.microchip.com/wwwproducts/en/en024610) and [Kanda board](https://www.kanda.com/products/Kanda/MICRO-X-BOARD.html) to create an automated coffee maker.
Using the microcontroller, we created a standard alarm clock. Then, we hacked apart the coffee maker's circuitry and hooked up its control line to the microcontroller. We used a photoresistor and relay to make a light sensor. When the system detected that it was daytime, it would (a) automatically turn on the coffee maker for a set period of time to brew a new cup of coffee. The goal was for the user to have a perfect cup of coffee brewed for them by the time they walk in the kitchen.
![image of Rise and Shine system]({{cdn:img/project/rise_and_shine/demo.png}})<The complete Rise and Shine system>
You can find a full write up of the project's technical details in the [project's repo](https://github.com/wcarhart/rise-and-shine/blob/master/Rise%20%26%20Shine.pdf).