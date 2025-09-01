import {type ClassValue,clsx } from 'clsx'
import {twMerge} from 'tailwind-merge'

export function cn(...inputs:ClassValue[]){
    return twMerge(clsx(inputs))
}

export function formatContact(contact:string):string{
    return contact.replace(/(\d{3})(\d{3})(\d{4})/,'($1) $2-$3')
}

