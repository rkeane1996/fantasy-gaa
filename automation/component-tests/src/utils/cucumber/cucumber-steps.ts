import { Given as given, Then as then, When as when } from '@cucumber/cucumber';
import { App } from '../../app/app';

type StepFunction = (app: App, ...args: any[]) => void | Promise<void>;

const customStep = async (
    stepType: (pattern: string | RegExp, implementation: Function) => void,
    pattern: string | RegExp,
    stepFn: (app: App, ...args: any) => void | Promise<void>
) => {
    const stepWrapper = async function (this: any, ...args: any[]) {
       const app = new App(this);  // Here, we ensure App is instantiated with the correct context
        try {
            console.log(`[Step Start] ${pattern}`);
            await stepFn(app);  // Ensure the function is awaited properly
        } catch (error) {
            console.error(`[Step Error] ${pattern}: ${error.message}`);
            throw error;
        } finally {
            console.log(`[Step End] ${pattern}`);
        }
    };
    await stepType(pattern, stepWrapper);
};





export const Given = (pattern: string | RegExp, stepFn: (app: App, ...args: any[]) => void | Promise<void>) => {
    console.log(`[Registering Step] Given ${pattern}`);
    customStep(given, pattern, stepFn);
};

export const When = (pattern: string | RegExp, stepFn: (app: App, ...args: any[]) => void | Promise<void>) => {
    console.log(`[Registering Step] When ${pattern}`);
    customStep(when, pattern, stepFn);
};

export const Then = (pattern: string | RegExp, stepFn: (app: App, ...args: any[]) => void | Promise<void>) => {
    console.log(`[Registering Step] Then ${pattern}`);
    customStep(then, pattern, stepFn);
};
