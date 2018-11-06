import { Application } from "express";

export interface IApp {
    start(): Application;
}
