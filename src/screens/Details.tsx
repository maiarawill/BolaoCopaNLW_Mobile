import { HStack, useToast, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { useRoute } from "@react-navigation/native";
import { PoolCardProps } from "../components/PoolCard";
import { api } from "../services/api";
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { Share } from "react-native";

interface RouteParams {
    id: string;
}


export function Details(){
    const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>('guesses');
    const [poolDetails, setPoolDetails] = useState<PoolCardProps>({} as PoolCardProps);
    const [isLoading, setIsLoading] = useState(true);

    const route = useRoute();
    const toast = useToast();

    const {id} = route.params as RouteParams; 
    
    async function fetchPoolDetails(){
        try{
            setIsLoading(true);
            const response = await api.get(`/pools/${id}`);
            setPoolDetails(response.data.pool);
        }catch(error){
            console.log(error)
            toast.show({
                title:'Detalhes não encontrados',
                bgColor: 'red.500',
                placement: 'top'
            })
        }finally{
            setIsLoading(false);
        }
    }

    async function handleCodeShare(){
        await Share.share({
            message: poolDetails.code
        });
    }

    useEffect(() => {
        fetchPoolDetails();
    }, [id]);

    if(isLoading){
        return(
            <Loading/>
        );
    }
   
    return(
        <VStack flex={1} bgColor="gray.900">
            <Header 
                title={poolDetails.title} 
                showBackButton 
                showShareButton 
                onShare={handleCodeShare}   
            />

            {
                poolDetails._count?.participants > 0 ?
                <VStack px={5} flex={1}>
                    <PoolHeader data={poolDetails}/>

                    <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
                        <Option 
                            title="Seus palpites" 
                            isSelected={optionSelected === 'guesses'} 
                            onPress={()=>setOptionSelected('guesses')}
                        />
                        <Option 
                            title="Ranking do grupo" 
                            isSelected={optionSelected === 'ranking'} 
                            onPress={()=>setOptionSelected('ranking')}
                        />    

                    </HStack> 
                </VStack>
                :   <EmptyMyPoolList code={poolDetails.code}/>  
            }
        </VStack>
    );
}