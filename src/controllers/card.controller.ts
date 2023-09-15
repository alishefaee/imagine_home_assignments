import { response, setCodeResponse } from "../utils/functions";
import { Code } from '../utils/consts.utils'
import PostCardService from '../services/card.service'
import httpContext from 'express-http-context'
import CardService from '../services/card.service'
import {Request,Response} from "express";

class Card {

    findOne = async (req:Request, res:Response) => {
        let postCard = await PostCardService.findOneBySlug(req.params.slug)
        if (!postCard) {
            httpContext.set('status',Code.DATA_NOT_FOUND)
            return response(res)
        }
        postCard.id = postCard._id.toString()

        return response(res, { ...postCard, _id: undefined })
    }

    findAll = async (req:Request, res:Response) => {
        let cards = await CardService.findAll(req.query)
        if (!cards) {
            setCodeResponse(Code.DATA_NOT_FOUND)
            return response(res, {})
        }

        cards.aggregate.forEach((elem:any,i:number)=>{
            cards.aggregate[i].id = elem._id
            cards.aggregate[i]._id = undefined
        })

        return response(res, cards)
    }
}

export default new Card()
