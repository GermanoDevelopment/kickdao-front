"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createConfig,
  http,
  useAccount,
  useConnect,
  useReadContract,
  useWriteContract,
  useChainId,
  usePublicClient,
} from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "./auth.context";
import { parseEther, decodeEventLog, Abi, Hash } from "viem";

// Tipagem para os eventos
interface ProjectCreatedEvent {
  projectId: bigint;
  creator: `0x${string}`;
  totalShares: bigint;
  pricePerShare: bigint;
}

interface SharesPurchasedEvent {
  projectId: bigint;
  buyer: `0x${string}`;
  amount: bigint;
}

// Tipagem para informações do projeto
interface ProjectInfo {
  creator: `0x${string}`;
  totalShares: bigint;
  availableShares: bigint;
  pricePerShare: bigint;
  creationDate: bigint;
}

// ABIs dos contratos
const KDAO_ABI = [
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "index", type: "uint256" },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "to", type: "address" }],
    name: "safeMint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: true, name: "tokenId", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
] as const;

const PROJECT_ABI = [
  {
    inputs: [
      { name: "account", type: "address" },
      { name: "id", type: "uint256" },
    ],
    name: "balanceOf",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "accounts", type: "address[]" },
      { name: "ids", type: "uint256[]" },
    ],
    name: "balanceOfBatch",
    outputs: [{ type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "operator", type: "address" },
      { name: "approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "account", type: "address" },
      { name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "id", type: "uint256" },
      { name: "amount", type: "uint256" },
      { name: "data", type: "bytes" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "ids", type: "uint256[]" },
      { name: "amounts", type: "uint256[]" },
      { name: "data", type: "bytes" },
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "uri", type: "string" },
      { name: "totalShares", type: "uint256" },
      { name: "pricePerShare", type: "uint256" },
    ],
    name: "createProject",
    outputs: [{ type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "projectId", type: "uint256" },
      { name: "amount", type: "uint256" },
    ],
    name: "buyShares",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ name: "projectId", type: "uint256" }],
    name: "getProjectInfo",
    outputs: [
      { name: "creator", type: "address" },
      { name: "totalShares", type: "uint256" },
      { name: "availableShares", type: "uint256" },
      { name: "pricePerShare", type: "uint256" },
      { name: "creationDate", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "projectId", type: "uint256" }],
    name: "getProjectURI",
    outputs: [{ type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "projectId", type: "uint256" },
      { indexed: true, name: "creator", type: "address" },
      { indexed: false, name: "totalShares", type: "uint256" },
      { indexed: false, name: "pricePerShare", type: "uint256" },
    ],
    name: "ProjectCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "projectId", type: "uint256" },
      { indexed: true, name: "buyer", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
    name: "SharesPurchased",
    type: "event",
  },
] as const;

// Configuração do Wagmi
const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [injected()],
});

// Tipos do contexto
interface ContractContextType {
  kdaoContractAddress: `0x${string}`;
  projectContractAddress: `0x${string}`;
  connected: boolean;
  connecting: boolean;
  hasKdaoToken: boolean;
  kdaoTokenId: number | null;
  kdaoTokenLoading: boolean;
  connectWallet: () => Promise<boolean>;
  checkKdaoToken: () => Promise<boolean>;
  mintKdaoToken: () => Promise<boolean>;
  createProject: (uri: string, totalShares: number, pricePerShare: number) => Promise<number | null>;
  buyProjectShares: (projectId: number, amount: number, price: number) => Promise<boolean>;
  getProjectShares: (projectId: number, address?: `0x${string}`) => Promise<number>;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export const useContract = () => {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error("useContract deve ser usado dentro de um ContractProvider");
  }
  return context;
};

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userProfile, setWalletInfo } = useAuth();

  // Endereços dos contratos com tipagem correta
  const kdaoContractAddress = "0x123456789abcdef123456789abcdef123456789a" as `0x${string}`;
  const projectContractAddress = "0xabcdef123456789abcdef123456789abcdef1234" as `0x${string}`;

  // Estados
  const [hasKdaoToken, setHasKdaoToken] = useState(false);
  const [kdaoTokenId, setKdaoTokenId] = useState<number | null>(null);
  const [kdaoTokenLoading, setKdaoTokenLoading] = useState(false);

  // Hooks do Wagmi
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending: connecting } = useConnect();
  const chainId = useChainId();
  const publicClient = usePublicClient();

  // Verifica o saldo do token KDAO
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: kdaoContractAddress,
    abi: KDAO_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  // Obtém o ID do token KDAO (se houver)
  const { data: tokenId, refetch: refetchTokenId } = useReadContract({
    address: kdaoContractAddress,
    abi: KDAO_ABI,
    functionName: "tokenOfOwnerByIndex",
    args: address && balance && balance > BigInt(0) ? [address, BigInt(0)] : undefined,
  });

  // Hooks para escrever nos contratos
  const { writeContractAsync: mintKdao } = useWriteContract();
  const { writeContractAsync: createProjectWrite } = useWriteContract();
  const { writeContractAsync: buyShares } = useWriteContract();

  // Efeito para carregar dados quando o endereço ou conexão mudar
  useEffect(() => {
    const loadData = async () => {
      if (address && isConnected) {
        await refetchBalance();
      }
    };
    loadData();
  }, [address, isConnected, refetchBalance]);

  // Efeito para carregar o token ID quando o saldo mudar
  useEffect(() => {
    const loadTokenId = async () => {
      if (address && isConnected && balance && balance > BigInt(0)) {
        await refetchTokenId();
      }
    };
    loadTokenId();
  }, [address, isConnected, balance, refetchTokenId]);

  // Atualiza o estado do token KDAO
  useEffect(() => {
    if (balance && address) {
      setKdaoTokenLoading(false);
      const hasToken = balance > BigInt(0);
      setHasKdaoToken(hasToken);
      if (hasToken && tokenId) {
        setKdaoTokenId(Number(tokenId));
      } else {
        setKdaoTokenId(null);
      }
    }
  }, [balance, tokenId, address]);

  // Sincroniza o endereço da carteira com o perfil do usuário
  useEffect(() => {
    if (user && userProfile && address && isConnected && address !== userProfile.walletAddress) {
      setWalletInfo(address, "ethereum");
    }
  }, [address, isConnected, user, userProfile, setWalletInfo]);

  // Função para conectar a carteira
  const connectWallet = async (): Promise<boolean> => {
    if (!connectors.length) {
      toast({
        title: "Metamask não encontrado",
        description: "Por favor, instale a extensão Metamask para continuar.",
        variant: "destructive",
      });
      return false;
    }

    try {
      connect({ connector: connectors[0] });
      toast({
        title: "Carteira conectada",
        description: "Sua carteira foi conectada com sucesso.",
      });
      return true;
    } catch (error) {
      console.error("Erro ao conectar carteira:", error);
      toast({
        title: "Erro ao conectar carteira",
        description: "Ocorreu um erro ao conectar sua carteira. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Função para verificar o token KDAO
  const checkKdaoToken = async (): Promise<boolean> => {
    if (!address || !isConnected) return false;

    try {
      setKdaoTokenLoading(true);
      await refetchBalance();
      await refetchTokenId();
      return hasKdaoToken;
    } catch (error) {
      console.error("Erro ao verificar token KDAO:", error);
      setHasKdaoToken(false);
      setKdaoTokenId(null);
      return false;
    } finally {
      setKdaoTokenLoading(false);
    }
  };

  // Função para mintar um token KDAO
  const mintKdaoToken = async (): Promise<boolean> => {
    if (!address || !isConnected) {
      toast({
        title: "Carteira não conectada",
        description: "Por favor, conecte sua carteira para continuar.",
        variant: "destructive",
      });
      return false;
    }

    if (!publicClient) {
      toast({
        title: "Cliente blockchain não disponível",
        description: "Não foi possível se conectar à rede blockchain.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const price = parseEther("0.1"); // Preço de 0.1 ETH
      const hash = await mintKdao({
        abi: KDAO_ABI,
        address: kdaoContractAddress,
        functionName: "safeMint",
        args: [address],
        value: price,
      });

      toast({
        title: "Transação enviada",
        description: "Aguarde a confirmação da transação...",
      });

      await publicClient.waitForTransactionReceipt({ hash });

      const hasToken = await checkKdaoToken();

      if (hasToken) {
        toast({
          title: "Token KDAO adquirido",
          description: "Você agora tem acesso à plataforma Kick DAO!",
        });
        return true;
      } else {
        toast({
          title: "Erro ao verificar token",
          description: "A transação foi confirmada, mas não foi possível verificar o token.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Erro ao mintar token KDAO:", error);
      toast({
        title: "Erro ao adquirir token",
        description: "Ocorreu um erro ao adquirir o token KDAO. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Função para criar um projeto
  const createProject = async (
    uri: string,
    totalShares: number,
    pricePerShare: number
  ): Promise<number | null> => {
    if (!address || !isConnected) {
      toast({
        title: "Carteira não conectada",
        description: "Por favor, conecte sua carteira para continuar.",
        variant: "destructive",
      });
      return null;
    }

    if (!publicClient) {
      toast({
        title: "Cliente blockchain não disponível",
        description: "Não foi possível se conectar à rede blockchain.",
        variant: "destructive",
      });
      return null;
    }

    if (!hasKdaoToken) {
      toast({
        title: "Acesso negado",
        description: "Você precisa ter um token KDAO para criar projetos.",
        variant: "destructive",
      });
      return null;
    }

    try {
      const priceInWei = parseEther(pricePerShare.toString());
      const hash = await createProjectWrite({
        abi: PROJECT_ABI,
        address: projectContractAddress,
        functionName: "createProject",
        args: [uri, BigInt(totalShares), priceInWei],
      });

      toast({
        title: "Transação enviada",
        description: "Aguarde a confirmação da criação do projeto...",
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      // Buscando pelo evento ProjectCreated corretamente tipado
      const projectCreatedEvent = receipt.logs.find((log: any) => {
        try {
          const decoded = decodeEventLog({
            abi: PROJECT_ABI as Abi,
            eventName: "ProjectCreated",
            topics: log.topics as [Hash, ...Hash[]],
            data: log.data,
          });
          return !!decoded;
        } catch (e) {
          return false;
        }
      });

      if (projectCreatedEvent) {
        try {
          const decoded = decodeEventLog({
            abi: PROJECT_ABI as Abi,
            eventName: "ProjectCreated",
            topics: projectCreatedEvent.topics as [Hash, ...Hash[]],
            data: projectCreatedEvent.data,
          }) as unknown as ProjectCreatedEvent;

          const projectId = Number(decoded.projectId);
          toast({
            title: "Projeto criado",
            description: `Seu projeto foi criado com sucesso! ID: ${projectId}`,
          });
          return projectId;
        } catch (error) {
          console.error("Erro ao decodificar evento:", error);
          toast({
            title: "Erro ao obter ID do projeto",
            description: "A transação foi confirmada, mas não foi possível interpretar o evento.",
            variant: "destructive",
          });
          return null;
        }
      } else {
        toast({
          title: "Erro ao obter ID do projeto",
          description: "A transação foi confirmada, mas não foi possível encontrar o evento de criação.",
          variant: "destructive",
        });
        return null;
      }
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      toast({
        title: "Erro ao criar projeto",
        description: "Ocorreu um erro ao criar o projeto. Tente novamente.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Função para comprar ações de um projeto
  const buyProjectShares = async (projectId: number, amount: number, price: number): Promise<boolean> => {
    if (!address || !isConnected) {
      toast({
        title: "Carteira não conectada",
        description: "Por favor, conecte sua carteira para continuar.",
        variant: "destructive",
      });
      return false;
    }

    if (!publicClient) {
      toast({
        title: "Cliente blockchain não disponível",
        description: "Não foi possível se conectar à rede blockchain.",
        variant: "destructive",
      });
      return false;
    }

    if (!hasKdaoToken) {
      toast({
        title: "Acesso negado",
        description: "Você precisa ter um token KDAO para investir em projetos.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const totalPrice = parseEther((price * amount).toString());
      const hash = await buyShares({
        abi: PROJECT_ABI,
        address: projectContractAddress,
        functionName: "buyShares",
        args: [BigInt(projectId), BigInt(amount)],
        value: totalPrice,
      });

      toast({
        title: "Transação enviada",
        description: "Aguarde a confirmação da compra de ações...",
      });

      await publicClient.waitForTransactionReceipt({ hash });

      toast({
        title: "Ações adquiridas",
        description: `Você adquiriu ${amount} ações do projeto com sucesso!`,
      });
      return true;
    } catch (error) {
      console.error("Erro ao comprar ações:", error);
      toast({
        title: "Erro ao comprar ações",
        description: "Ocorreu um erro ao comprar ações do projeto. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Função para obter o número de ações de um projeto
  const getProjectShares = async (projectId: number, addressOverride?: `0x${string}`): Promise<number> => {
    if ((!address && !addressOverride) || !publicClient) return 0;

    try {
      const balance = await publicClient.readContract({
        address: projectContractAddress,
        abi: PROJECT_ABI,
        functionName: "balanceOf",
        args: [addressOverride || address as `0x${string}`, BigInt(projectId)],
      });
      return Number(balance);
    } catch (error) {
      console.error("Erro ao obter ações do projeto:", error);
      return 0;
    }
  };

  const value = {
    kdaoContractAddress,
    projectContractAddress,
    connected: isConnected,
    connecting,
    hasKdaoToken,
    kdaoTokenId,
    kdaoTokenLoading,
    connectWallet,
    checkKdaoToken,
    mintKdaoToken,
    createProject,
    buyProjectShares,
    getProjectShares,
  };

  return (
    <ContractContext.Provider value={value}>{children}</ContractContext.Provider>
  );
};