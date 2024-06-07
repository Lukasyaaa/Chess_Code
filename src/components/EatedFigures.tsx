import React, { FC } from "react";
import { Figure } from "../modules/figures/Figure";

interface EatedFiguresProps{
    eatedBlack : Figure[],
    eatedWhite : Figure[]
}

interface matches{
    figure : Figure,
    count  : number
}

export const EatedFigures : FC<EatedFiguresProps> = ({eatedBlack, eatedWhite}) =>{
    let sortedMassiveBlack : matches[] = [];
    let sortedMassiveWhite : matches[] = [];

    for(const figure of eatedBlack){
        let addNew : boolean = true;
        for(let i : number = 0; i < sortedMassiveBlack.length; i++){
            if(sortedMassiveBlack[i].figure.getType() === figure.getType()){
                sortedMassiveBlack[i].count += 1;
                addNew = false;
                break;
            }
        }
        if(addNew){
            sortedMassiveBlack.push({figure: figure, count: 1});
        }
    }

    for(const figure of eatedWhite){
        let addNew : boolean = true;
        for(let i : number = 0; i < sortedMassiveWhite.length; i++){
            if(sortedMassiveWhite[i].figure.getType() === figure.getType()){
                sortedMassiveWhite[i].count += 1;
                addNew = false;
                break;
            }
        }
        if(addNew){
            sortedMassiveWhite.push({figure: figure, count: 1});
        }
    }
    
    return(
        <div className="eated-figures">
            <div className="eated-figures__item item-eated-figures item_white-eated-figures">
                <h2 className="item-eated-figures__heading item_white-eated-figures__heading">White Figures</h2>
                <ul className="item-eated-figures__list item_white-eated-figures__list">
                    {sortedMassiveWhite.map((match, index) => 
                        <li key={index} className="item-eated-figures__link item_white-eated-figures__link">
                            <img src={match.figure.getSrc()} alt={match.figure.getType()} />
                            <span className="item-eated-figures__count item_white-eated-figures__count">{match.count}</span>
                        </li>
                    )}
                </ul>
            </div>
            <div className="eated-figures__item item-eated-figures item_black-eated-figures">
                <h2 className="item-eated-figures__heading item_black-eated-figures__heading">Black Figures</h2>
                <ul className="item-eated-figures__list item_black-eated-figures__list">
                    {sortedMassiveBlack.map((match, index) => 
                        <li key={index} className="item-eated-figures__link item_black-eated-figures__link">
                            <img src={match.figure.getSrc()} alt={match.figure.getType()} />
                            <span className="item-eated-figures__count item_black-eated-figures__count">{match.count}</span>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}