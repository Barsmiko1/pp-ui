"\"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ArchitectureDiagram from "./architecture-diagram"
import DomainModels from "./domain-models"
import ServiceImplementations from "./service-implementations"
import ImplementationGuide from "./implementation-guide"
import ControllerImplementations from "./controller-implementations"

export default function MainPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Papay Moni P2P Middleware System</h1>
      <p className="text-gray-600 mb-8">Java 8 Architecture and Implementation Guide</p>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="grid grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="models">Domain Models</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="controllers">Controllers</TabsTrigger>
          <TabsTrigger value="implementation">Implementation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">System Overview</h2>
              <p>
                Papay Moni is a middleware platform that automates peer-to-peer (P2P) cryptocurrency trading on Bybit
                for both merchants and regular users. The system leverages Bybit's Open API to facilitate seamless asset
                buying and selling without requiring manual intervention.
              </p>

              <h3 className="text-xl font-semibold mt-4">Key Features</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Automated Trading: Executes P2P buy and sell orders on Bybit on behalf of users</li>
                <li>API Integration: Connects to users' Bybit accounts via their API keys and signatures</li>
                <li>Virtual Accounts: Provides static virtual accounts for deposits and withdrawals</li>
                <li>Dual Functionality: "Buy" corresponds to withdrawals and "Sell" corresponds to deposits</li>
                <li>Commission-based Revenue: 1.2% commission on each successful trade (capped at 1,200 NGN)</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Technical Stack</h2>
              <div className="space-y-2">
                <div>
                  <h3 className="text-lg font-semibold">Backend</h3>
                  <ul className="list-disc list-inside">
                    <li>Java 8</li>
                    <li>Spring Boot</li>
                    <li>Spring Security with JWT</li>
                    <li>Spring Data JPA</li>
                    <li>PostgreSQL</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Integration</h3>
                  <ul className="list-disc list-inside">
                    <li>Bybit Open API</li>
                    <li>Payment Gateway API</li>
                    <li>Virtual Account Provider API</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Infrastructure</h3>
                  <ul className="list-disc list-inside">
                    <li>RabbitMQ for messaging</li>
                    <li>Redis for caching</li>
                    <li>Quartz for scheduling</li>
                    <li>Docker for containerization</li>
                    <li>Kubernetes for orchestration</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">User Journey</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>User registers on the Papay Moni platform</li>
              <li>User securely adds their Bybit API credentials (API key, signature, and timestamp)</li>
              <li>User tests the API connection to ensure credentials are valid</li>
              <li>User can manage advertisements, view orders, and process transactions</li>
              <li>The middleware automatically handles buy orders (withdrawals) and sell orders (deposits)</li>
              <li>Transactions are processed through dedicated virtual accounts, connected to a GL system</li>
              <li>Platform charges 1.2% commission on each successful trade (capped at 1,200 NGN)</li>
            </ol>
          </div>
        </TabsContent>

        <TabsContent value="architecture">
          <ArchitectureDiagram />
        </TabsContent>

        <TabsContent value="models">
          <DomainModels />
        </TabsContent>

        <TabsContent value="services">
          <ServiceImplementations />
        </TabsContent>

        <TabsContent value="controllers">
          <ControllerImplementations />
        </TabsContent>

        <TabsContent value="implementation">
          <ImplementationGuide />
        </TabsContent>
      </Tabs>
    </div>
  )
}
