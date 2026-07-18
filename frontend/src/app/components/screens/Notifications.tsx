import { Layout } from '../Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Bell, CheckCircle2, Clock, FileText, AlertCircle, TrendingUp, User, Map } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export function Notifications() {
  const allNotifications = [
    {
      id: 1,
      type: 'success',
      icon: CheckCircle2,
      title: 'Property Registration Completed',
      description: 'Your property SN-2023-4521 has been successfully registered on the blockchain',
      time: '2 hours ago',
      read: false,
      property: 'SN-2023-4521'
    },
    {
      id: 2,
      type: 'warning',
      icon: AlertCircle,
      title: 'Ownership Transfer Pending',
      description: 'Transfer request for property SN-2023-4520 requires your approval',
      time: '5 hours ago',
      read: false,
      property: 'SN-2023-4520'
    },
    {
      id: 3,
      type: 'info',
      icon: FileText,
      title: 'Document Verification Complete',
      description: 'All documents for property SN-2023-4519 have been verified successfully',
      time: '1 day ago',
      read: true,
      property: 'SN-2023-4519'
    },
    {
      id: 4,
      type: 'success',
      icon: TrendingUp,
      title: 'Property Value Updated',
      description: 'Market value assessment completed for SN-2023-4518',
      time: '2 days ago',
      read: true,
      property: 'SN-2023-4518'
    },
    {
      id: 5,
      type: 'info',
      icon: User,
      title: 'New Co-Owner Added',
      description: 'A new co-owner has been added to property SN-2023-4517',
      time: '3 days ago',
      read: true,
      property: 'SN-2023-4517'
    },
    {
      id: 6,
      type: 'info',
      icon: Map,
      title: 'GIS Boundary Updated',
      description: 'Property boundaries have been updated in the GIS system for SN-2023-4516',
      time: '4 days ago',
      read: true,
      property: 'SN-2023-4516'
    }
  ];

  const unreadNotifications = allNotifications.filter(n => !n.read);
  const transactionNotifications = allNotifications.filter(n =>
    ['Property Registration Completed', 'Ownership Transfer Pending'].includes(n.title)
  );
  const documentNotifications = allNotifications.filter(n =>
    ['Document Verification Complete'].includes(n.title)
  );

  const NotificationList = ({ notifications }: { notifications: typeof allNotifications }) => (
    <div className="space-y-4">
      {notifications.map((notification) => {
        const Icon = notification.icon;
        return (
          <Card key={notification.id} className={`border-[#E2E8F0] ${!notification.read ? 'bg-[#0F766E]/5' : ''}`}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  notification.type === 'success'
                    ? 'bg-[#16A34A]/10'
                    : notification.type === 'warning'
                    ? 'bg-[#DC2626]/10'
                    : 'bg-[#38BDF8]/10'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    notification.type === 'success'
                      ? 'text-[#16A34A]'
                      : notification.type === 'warning'
                      ? 'text-[#DC2626]'
                      : 'text-[#38BDF8]'
                  }`} />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-[#0F172A]">{notification.title}</h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-[#0F766E] rounded-full"></div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#64748B]">
                      <Clock className="w-3 h-3" />
                      <span>{notification.time}</span>
                    </div>
                  </div>

                  <p className="text-sm text-[#64748B] mb-3">{notification.description}</p>

                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="border-[#E2E8F0] text-[#0F172A]">
                      {notification.property}
                    </Badge>
                    {!notification.read && (
                      <Button variant="link" className="h-auto p-0 text-[#0F766E] text-sm">
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  return (
    <Layout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-[#0F172A] mb-2">Notifications</h1>
            <p className="text-[#64748B]">Stay updated with your property activities and transactions</p>
          </div>
          <Button variant="outline" className="border-[#E2E8F0] w-full sm:w-auto">
            Mark all as read
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Notifications Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all">
                  All ({allNotifications.length})
                </TabsTrigger>
                <TabsTrigger value="unread">
                  Unread ({unreadNotifications.length})
                </TabsTrigger>
                <TabsTrigger value="transactions">
                  Transactions
                </TabsTrigger>
                <TabsTrigger value="documents">
                  Documents
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <NotificationList notifications={allNotifications} />
              </TabsContent>

              <TabsContent value="unread">
                {unreadNotifications.length > 0 ? (
                  <NotificationList notifications={unreadNotifications} />
                ) : (
                  <Card className="border-[#E2E8F0]">
                    <CardContent className="p-12 text-center">
                      <CheckCircle2 className="w-16 h-16 text-[#16A34A] mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-[#0F172A] mb-2">All caught up!</h3>
                      <p className="text-[#64748B]">You have no unread notifications</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="transactions">
                <NotificationList notifications={transactionNotifications} />
              </TabsContent>

              <TabsContent value="documents">
                <NotificationList notifications={documentNotifications} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Activity Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0F766E]/10 rounded-full flex items-center justify-center">
                      <Bell className="w-5 h-5 text-[#0F766E]" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-[#0F172A]">{unreadNotifications.length}</p>
                      <p className="text-sm text-[#64748B]">Unread</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#64748B]">This Week</span>
                    <span className="text-sm font-medium text-[#0F172A]">4 notifications</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#64748B]">This Month</span>
                    <span className="text-sm font-medium text-[#0F172A]">12 notifications</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64748B]">Total</span>
                    <span className="text-sm font-medium text-[#0F172A]">{allNotifications.length} notifications</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Quick Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start border-[#E2E8F0]">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-[#16A34A]" />
                  Completed Actions
                </Button>
                <Button variant="outline" className="w-full justify-start border-[#E2E8F0]">
                  <Clock className="w-4 h-4 mr-2 text-[#38BDF8]" />
                  Pending Actions
                </Button>
                <Button variant="outline" className="w-full justify-start border-[#E2E8F0]">
                  <AlertCircle className="w-4 h-4 mr-2 text-[#DC2626]" />
                  Requires Attention
                </Button>
              </CardContent>
            </Card>

            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Notification Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#64748B] mb-4">Customize how you receive notifications</p>
                <Button variant="outline" className="w-full border-[#E2E8F0]">
                  Manage Preferences
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
